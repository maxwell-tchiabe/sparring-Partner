import uuid
from datetime import UTC, datetime
from typing import Literal

from pydantic import AliasGenerator, BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class MessageContent(BaseModel):
    """Content of a message."""
    model_config = ConfigDict(
        alias_generator=AliasGenerator(
            validation_alias=to_camel,
            serialization_alias=to_camel,
        ),
        populate_by_name=True
    )

    type: Literal["conversation", "audio", "image", "pdf"]
    text: str
    audioFile: bytes | None = None
    imageFile: bytes | None = None
    pdfUrl: str | None = None


class Message(BaseModel):
    """Message model for Supabase storage."""
    model_config = ConfigDict(
        alias_generator=AliasGenerator(
            validation_alias=to_camel,
            serialization_alias=to_camel,
        ),
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

    # For Supabase, we need to ensure id is a UUID
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    sender: Literal["user", "assistant"]
    content: MessageContent
    timestamp: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
    audio: str | None = None
    image: str | None = None
    pdf: str | None = None