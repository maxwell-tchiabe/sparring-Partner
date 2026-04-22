import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from uuid import UUID
import json

from ai_companion.database.supabase import db
from ai_companion.models.dashboard import (
    DashboardStats, AIInsight, Badge, LearningError,
    VocabularyStats, ConversationStats, GrammarStats, WeeklyProgress
)
from ai_companion.graph.utils.helpers import get_chat_model
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

class ErrorExtraction(BaseModel):
    category: str = Field(description="Category of the error (e.g., 'Grammar', 'Vocabulary')")
    detail: str = Field(description="The original incorrect text")
    correction: str = Field(description="The corrected version")

class DashboardAnalysis(BaseModel):
    errors: List[ErrorExtraction] = Field(default_factory=list)
    insight: Optional[str] = Field(None, description="A pedagogical insight or encouragement")

class DashboardService:
    @staticmethod
    async def get_stats(user_id: str) -> DashboardStats:
        """Calculate and return dashboard stats for a user"""
        try:
            sessions = await db.get_chat_sessions(user_id)
            total_sessions = len(sessions)
            logger.info(f"[DashboardStats] Found {total_sessions} sessions for user {user_id}")
            
            # Get all messages to calculate unique words and grammar score
            all_messages = []
            active_days = set()
            
            for session in sessions:
                msgs = await db.get_messages(session.id, limit=1000)
                user_msgs = [m for m in msgs if m.sender == "user"]
                all_messages.extend(user_msgs)
                for m in user_msgs:
                    # Parse ISO string to datetime object
                    ts = m.timestamp.replace('Z', '+00:00')
                    dt = datetime.fromisoformat(ts)
                    active_days.add(dt.date())

            # Vocabulary: Unique words
            unique_words = set()
            for m in all_messages:
                words = m.content.text.lower().split()
                unique_words.update(words)
            
            learned_vocab = len(unique_words)
            
            # Errors count
            errors = await db.get_user_learning_errors(user_id)
            error_count = len(errors)
            
            # Grammar Score: 100 base, subtract for each error relative to messages
            total_msgs = len(all_messages)
            if total_msgs == 0:
                grammar_score = 100
            else:
                grammar_score = max(0, 100 - int((error_count / total_msgs) * 100))

            # Weekly Progress
            last_7_days = [(datetime.now() - timedelta(days=i)).date() for i in range(7)]
            days_active = sum(1 for d in last_7_days if d in active_days)

            logger.info(f"[DashboardStats] Result: learned_vocab={learned_vocab}, error_count={error_count}, grammar_score={grammar_score}, days_active={days_active}")

            return DashboardStats(
                vocabulary=VocabularyStats(learned=learned_vocab, total=500),
                conversations=ConversationStats(completed=total_sessions, total=20),
                grammarScore=GrammarStats(current=grammar_score, total=100),
                weeklyProgress=WeeklyProgress(daysActive=days_active, daysTotal=7)
            )
        except Exception as e:
            logger.error(f"Error calculating dashboard stats: {e}")
            return DashboardStats()

    @staticmethod
    async def get_insights(user_id: str) -> List[AIInsight]:
        """Fetch or generate AI insights for the user"""
        # For now, we return a pedagogical insight or check if we have stored some.
        # Minimal implementation: return one static for demo or dynamic if history exists.
        errors = await db.get_user_learning_errors(user_id, limit=5)
        
        if not errors:
            return [AIInsight(type="improvement", content="Start your first conversation to get personalized learning insights!")]
        
        # Simple heuristic based on errors
        categories = {}
        for e in errors:
            cat = e.get("category", "General")
            categories[cat] = categories.get(cat, 0) + 1
            
        top_category = max(categories, key=categories.get)
        
        return [
            AIInsight(
                type="suggestion",
                content=f"You've encountered several {top_category} challenges recently. Focusing on these will significantly boost your fluency!"
            ),
            AIInsight(
                type="warning",
                content="Watch out for common sentence structure patterns we've discussed."
            )
        ]

    @staticmethod
    async def get_badges(user_id: str) -> List[Badge]:
        """Retrieve badges earned by the user"""
        badge_data = await db.get_user_badges(user_id)
        return [Badge(**b) for b in badge_data]

    @staticmethod
    async def get_learning_errors(user_id: str) -> List[LearningError]:
        """Retrieve learning errors for the user"""
        error_data = await db.get_user_learning_errors(user_id)
        return [LearningError(**e) for e in error_data]

    @staticmethod
    async def process_message_for_dashboard(user_id: str, message_id: str):
        """Asynchronous task to analyze a message for errors and badges"""
        try:
            logger.info(f"[DashboardAnalysis] Starting analysis for user={user_id} message={message_id}")
            message = await db.get_message(message_id)
            if not message:
                logger.warning(f"[DashboardAnalysis] Message {message_id} not found")
                return
            
            if message.sender != "user":
                logger.debug(f"[DashboardAnalysis] Skipping message from {message.sender}")
                return

            # 1. Detect Errors using LLM
            model = get_chat_model(temperature=0).with_structured_output(DashboardAnalysis)
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a professional language tutor. Analyze the user's message for any linguistic errors (grammar, vocabulary, syntax). If you find any, extract them. Also provide a brief pedagogical insight if relevant."),
                ("user", "{text}")
            ])
            
            chain = prompt | model
            analysis = await chain.ainvoke({"text": message.content.text})
            
            logger.info(f"[DashboardAnalysis] LLM detected {len(analysis.errors)} errors and 1 insight")

            # Save detected errors
            for err in analysis.errors:
                error_item = {
                    "user_id": user_id,
                    "session_id": message.session_id,
                    "category": err.category,
                    "detail": err.detail,
                    "correction": err.correction,
                    "timestamp": datetime.now().isoformat()
                }
                await db.save_learning_error(error_item)
                logger.debug(f"[DashboardAnalysis] Saved learning error: {err.category}")

            # 2. Check for Badge Triggers
            # First Steps Badge
            existing_badges = await db.get_user_badges(user_id)
            badge_names = [b["name"] for b in existing_badges]

            if "First Steps" not in badge_names:
                await db.save_badge({
                    "user_id": user_id,
                    "name": "First Steps",
                    "description": "Sent your first message to your AI partner!",
                    "icon": "Footprints",
                    "earned_at": datetime.now().isoformat()
                })

            # Chatty Badge (10 messages in current session)
            session_messages = await db.get_messages(message.session_id)
            user_session_msgs = [m for m in session_messages if m.sender == "user"]
            if len(user_session_msgs) >= 10 and "Chatty" not in badge_names:
                await db.save_badge({
                    "user_id": user_id,
                    "name": "Chatty",
                    "description": "Engaged in a long conversation with 10+ messages!",
                    "icon": "MessageSquareText",
                    "earned_at": datetime.now().isoformat()
                })
                logger.info(f"[DashboardAnalysis] Awarded 'Chatty' badge to user {user_id}")

            logger.info(f"[DashboardAnalysis] Analysis complete for message {message_id}")

        except Exception as e:
            logger.error(f"Error in background processing for dashboard: {e}")
