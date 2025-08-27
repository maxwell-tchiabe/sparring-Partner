from datetime import datetime, timezone
from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict, field_validator
import uuid


class MessageContent(BaseModel):
    """Content of a message."""
    type: Literal["conversation", "audio", "image", "pdf"]
    text: str
    audioFile: Optional[bytes] = None
    imageFile: Optional[bytes] = None
    pdfUrl: Optional[str] = None


class Message(BaseModel):
    """Message model for Supabase storage."""
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True
        # Remove: Not needed for Supabase as it uses UUID
        # json_encoders={ObjectId: str}
    )

    # For Supabase, we need to ensure id is a UUID
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    sender: Literal["user", "assistant"]
    content: MessageContent
    # Note: Supabase will automatically handle timestamp with created_at
    # but we keep this for application logic
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    audio: Optional[str] = None
    image: Optional[str] = None
    pdf: Optional[str] = None