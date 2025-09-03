from supabase import create_client, Client
from typing import List, Optional, Dict, Any
from ..models.message import Message
from ..models.chat_session import ChatSession
from ..settings import settings
from ..core.helpers import clean_env_var
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SupabaseManager:
    def __init__(self):
        self.client: Client = create_client(
            clean_env_var(settings.SUPABASE_URL),
            clean_env_var(settings.SUPABASE_KEY)
        )
        logger.info("Supabase manager initialized")

    async def save_message(self, message: Message) -> Message:
        """Save a new message to the database"""
        try:
            print(f"[DEBUG] Saving message for session: {message.session_id}")
            message_dict = message.model_dump(by_alias=True)
            print(f"[DEBUG] Message dict before insert: {message_dict}")
            
            result = self.client.table("messages").insert(message_dict).execute()
            print(f"[DEBUG] Message insert result: {result}")
            
            if not result.data:
                print(f"[ERROR] No data returned from message insert operation")
                raise RuntimeError("Failed to save message")
            
            # Update chat session title based on first user message
            if message.sender == "user":
                print(f"[DEBUG] Checking message count for session {message.session_id}")
                messages_count = len(self.client.table("messages")
                    .select("id")
                    .eq("session_id", message.session_id)
                    .execute().data)
                print(f"[DEBUG] Message count for session: {messages_count}")
                
                if messages_count == 1:
                    print(f"[DEBUG] First message in session, updating title")
                    title = message.content.text[:30] + "..." if len(message.content.text) > 30 else message.content.text
                    title = "".join(char for char in title if char.isprintable())  # Clean title
                    print(f"[DEBUG] New title: {repr(title)}")
                    update_result = self.client.table("chat_sessions").update({"title": title}).eq("id", message.session_id).execute()
                    print(f"[DEBUG] Title update result: {update_result}")
            
            saved_message = Message(**result.data[0])
            print(f"[DEBUG] Successfully saved message with ID: {saved_message.id}")
            return saved_message
            
        except Exception as e:
            print(f"[ERROR] Error saving message: {str(e)}")
            print(f"[ERROR] Message data that caused error: {vars(message)}")
            raise RuntimeError(f"Failed to save message: {str(e)}")

    async def get_messages(self, session_id: str, limit: int = 50) -> List[Message]:
        """Retrieve messages for a session"""
        try:
            if not session_id:
                raise ValueError("session_id must be a non-empty string")
                
            if limit < 1:
                raise ValueError("limit must be a positive integer")

            result = (self.client.table("messages")
                .select("*")
                .eq("session_id", session_id)
                .order("timestamp", desc=False)
                .limit(limit)
                .execute())
            
            return [Message(**msg) for msg in result.data]
            
        except Exception as e:
            error_msg = f"Error retrieving messages for session {session_id}: {str(e)}"
            logger.error(error_msg)
            raise RuntimeError(error_msg)

    async def get_message(self, message_id: str) -> Optional[Message]:
        """Retrieve a specific message by ID"""
        try:
            result = (self.client.table("messages")
                .select("*")
                .eq("id", message_id)
                .single()
                .execute())
            
            return Message(**result.data) if result.data else None
            
        except Exception as e:
            logger.error(f"Error retrieving message: {str(e)}")
            raise RuntimeError(f"Failed to retrieve message: {str(e)}")

    async def create_chat_session(self, session: ChatSession) -> ChatSession:
        """Create a new chat session"""
        try:
            print(f"[DEBUG] Creating chat session with ID: {session.id}")
            print(f"[DEBUG] Original title: {repr(session.title)}")
            
            # Clean the title field to remove any non-printable characters
            session.title = "".join(char for char in session.title if char.isprintable())
            print(f"[DEBUG] Cleaned title: {repr(session.title)}")
            
            session_dict = session.model_dump(by_alias=True)
            print(f"[DEBUG] Session dict before insert: {session_dict}")
            
            result = self.client.table("chat_sessions").insert(session_dict).execute()
            print(f"[DEBUG] Insert result: {result}")
            
            if not result.data:
                print(f"[ERROR] No data returned from insert operation")
                raise RuntimeError("Failed to create chat session")
            
            created_session = ChatSession(**result.data[0])
            print(f"[DEBUG] Successfully created chat session: {created_session}")
            return created_session
            
        except Exception as e:
            print(f"[ERROR] Error creating chat session: {str(e)}")
            print(f"[ERROR] Session data that caused error: {vars(session)}")
            raise RuntimeError(f"Failed to create chat session: {str(e)}")

    async def get_chat_sessions(self, user_id: Optional[str] = None, limit: int = 50) -> List[ChatSession]:
        """Retrieve chat sessions, optionally filtered by user_id"""
        try:
            query = self.client.table("chat_sessions").select("*")
            
            if user_id:
                query = query.eq("user_id", user_id)
                
            result = query.order("created_at", desc=True).limit(limit).execute()
            return [ChatSession(**session) for session in result.data]
            
        except Exception as e:
            logger.error(f"Error retrieving chat sessions: {str(e)}")
            raise RuntimeError(f"Failed to retrieve chat sessions: {str(e)}")

    async def get_chat_session(self, session_id: str) -> Optional[ChatSession]:
        """Get a single chat session by ID"""
        try:
            result = (self.client.table("chat_sessions")
                .select("*")
                .eq("id", session_id)
                .single()
                .execute())
            
            return ChatSession(**result.data) if result.data else None
            
        except Exception as e:
            logger.error(f"Error retrieving chat session: {str(e)}")
            raise RuntimeError(f"Failed to retrieve chat session: {str(e)}")

    async def update_chat_session(self, session_id: str, update_data: dict) -> bool:
        """Update a chat session"""
        try:
            result = (self.client.table("chat_sessions")
                .update(update_data)
                .eq("id", session_id)
                .execute())
            
            return bool(result.data)
            
        except Exception as e:
            logger.error(f"Error updating chat session: {str(e)}")
            raise RuntimeError(f"Failed to update chat session: {str(e)}")

    async def delete_chat_session(self, session_id: str) -> bool:
        """Delete a chat session and all its messages"""
        try:
            # Delete all messages in the session first
            (self.client.table("messages")
                .delete()
                .eq("session_id", session_id)
                .execute())
            
            # Then delete the session
            result = (self.client.table("chat_sessions")
                .delete()
                .eq("id", session_id)
                .execute())
            
            return bool(result.data)
            
        except Exception as e:
            logger.error(f"Error deleting chat session: {str(e)}")
            raise RuntimeError(f"Failed to delete chat session: {str(e)}") 

# Create a singleton instance
db = SupabaseManager()
