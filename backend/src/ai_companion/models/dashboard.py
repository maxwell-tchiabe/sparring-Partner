from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID, uuid4

class VocabularyStats(BaseModel):
    learned: int = 0
    total: int = 1000  # Default goal

class ConversationStats(BaseModel):
    completed: int = 0
    total: int = 10  # Weekly goal

class GrammarStats(BaseModel):
    current: int = 100
    total: int = 100

class WeeklyProgress(BaseModel):
    daysActive: int = 0
    daysTotal: int = 7

class DashboardStats(BaseModel):
    vocabulary: VocabularyStats = Field(default_factory=VocabularyStats)
    conversations: ConversationStats = Field(default_factory=ConversationStats)
    grammarScore: GrammarStats = Field(default_factory=GrammarStats)
    weeklyProgress: WeeklyProgress = Field(default_factory=WeeklyProgress)

class AIInsight(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    type: str  # 'improvement' | 'suggestion' | 'warning'
    content: str
    createdAt: datetime = Field(default_factory=datetime.now)

class Badge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    description: str
    earnedAt: datetime = Field(default_factory=datetime.now)
    icon: str  # Lucide icon name

class LearningError(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    timestamp: datetime = Field(default_factory=datetime.now)
    category: str
    detail: str
    correction: str
    session_id: Optional[UUID] = None
