from datetime import datetime, timezone
from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId


class MessageContent(BaseModel):
    """Content of a message."""
    type: Literal["conversation", "audio", "image", "pdf"]
    text: str
    audioFile: Optional[bytes] = None
    imageFile: Optional[bytes] = None
    pdfUrl: Optional[str] = None


class Message(BaseModel):
    """Message model for MongoDB storage."""
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )

    id: str = Field(default=None, alias="_id")
    session_id: str
    sender: Literal["user", "assistant"]
    content: MessageContent
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    audio: Optional[str] = None
    image: Optional[str] = None
    pdf: Optional[str] = None