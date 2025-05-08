from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
from bson import ObjectId
from typing import List, Optional
from ..models.message import Message
from ..settings import settings
import logging

logger = logging.getLogger(__name__)

class MongoDBManager:
    def __init__(self):
        # Initialize Motor's async MongoDB client
        self.client = AsyncIOMotorClient(
            settings.MONGO_URI,
        )
        self.db = self.client.get_database("dev_language_assistant")
        self.messages_collection = self.db["messages"]
        logger.info("MongoDB manager initialized")

    async def init_indexes(self):
        """Initialize database indexes"""
        try:
            # Create compound index for better query performance
            await self.messages_collection.create_index([
                ("session_id", 1),
                ("timestamp", 1)
            ])
            logger.info("MongoDB indexes created successfully")
        except PyMongoError as e:
            logger.error(f"Error creating indexes: {str(e)}")
            raise

    def _prepare_for_mongo(self, message: Message) -> dict:
        """Prepare message for MongoDB storage"""
        message_dict = message.model_dump(by_alias=True)
        if "_id" in message_dict and not message_dict["_id"]:
            del message_dict["_id"]
        return message_dict

    def _prepare_from_mongo(self, message_dict: dict) -> dict:
        """Prepare MongoDB document for Message model"""
        if "_id" in message_dict:
            message_dict["_id"] = str(message_dict["_id"])
        return message_dict

    async def save_message(self, message: Message) -> Message:
        """Save a new message to the database"""
        try:
            message_dict = self._prepare_for_mongo(message)
            result = await self.messages_collection.insert_one(message_dict)
            message_dict["_id"] = str(result.inserted_id)
            return Message(**message_dict)
        except PyMongoError as e:
            logger.error(f"Error saving message: {str(e)}")
            raise RuntimeError(f"Failed to save message: {str(e)}")

    async def get_messages(self, session_id: str, limit: int = 50) -> List[Message]:
        """Retrieve messages for a session
        
        Args:
            session_id (str): The unique identifier of the session
            limit (int, optional): Maximum number of messages to retrieve. Defaults to 50.
            
        Returns:
            List[Message]: List of messages sorted by timestamp
            
        Raises:
            ValueError: If session_id is empty or limit is less than 1
            RuntimeError: If database operation fails
        """
        # Parameter validation
        if not session_id or not isinstance(session_id, str):
            logger.error(f"Invalid session_id provided: {session_id}")
            raise ValueError("session_id must be a non-empty string")
            
        if not isinstance(limit, int) or limit < 1:
            logger.error(f"Invalid limit provided: {limit}")
            raise ValueError("limit must be a positive integer")

        try:
            cursor = self.messages_collection.find(
                {"session_id": session_id}
            ).sort("timestamp", 1).limit(limit)
            
            messages = await cursor.to_list(length=limit)
            message_count = len(messages)
            logger.info(f"Retrieved {message_count} messages for session {session_id}")
            
            return [Message(**self._prepare_from_mongo(msg)) for msg in messages]
            
        except PyMongoError as e:
            error_msg = f"Database error while retrieving messages for session {session_id}: {str(e)}"
            logger.error(error_msg)
            raise RuntimeError(error_msg)
        except Exception as e:
            error_msg = f"Unexpected error while retrieving messages for session {session_id}: {str(e)}"
            logger.error(error_msg)
            raise RuntimeError(error_msg)

    async def get_message(self, message_id: str) -> Optional[Message]:
        """Retrieve a specific message by ID"""
        try:
            message = await self.messages_collection.find_one(
                {"_id": ObjectId(message_id)}
            )
            if message:
                message = self._prepare_from_mongo(message)
                return Message(**message)
            return None
        except PyMongoError as e:
            logger.error(f"Error retrieving message: {str(e)}")
            raise RuntimeError(f"Failed to retrieve message: {str(e)}")

    async def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

# Create a singleton instance
db = MongoDBManager()