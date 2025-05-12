from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId


class ChatSession(BaseModel):
    """Chat session model for MongoDB storage."""
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )

    id: str = Field(default=None, alias="_id")
    title: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    user_id: Optional[str] = None  # For future user authentication implementation