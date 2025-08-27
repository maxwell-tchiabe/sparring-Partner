from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
import uuid

class ChatSession(BaseModel):
    """Chat session model for Supabase storage."""
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True
    )    
    # For Supabase, we need to ensure id is a UUID
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    user_id: str