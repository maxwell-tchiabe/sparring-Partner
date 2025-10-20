import logging
import base64
from io import BytesIO
from typing import Dict, Optional, List
from jose import JWTError, jwt

from fastapi import APIRouter, Response, UploadFile, File, Form, HTTPException, Body, Query, Path, Request
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi
from fastapi.openapi.docs import get_swagger_ui_html
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
from ai_companion.core.auth import verify_token

from ai_companion.graph import graph_builder
from ai_companion.modules.image import ImageToText
from ai_companion.modules.speech import SpeechToText, TextToSpeech
from ai_companion.settings import settings
#from ai_companion.database.mongodb import db
from ai_companion.database.supabase import db
from ai_companion.models.message import Message, MessageContent
from ai_companion.models.chat_session import ChatSession

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Apply to router (FastAPI v0.95+)
def include_limiter(app):
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, rate_limit_handler)
    app.add_middleware(SlowAPIMiddleware)

# Rate limit error handler
async def rate_limit_handler(request: Request, exc: RateLimitExceeded) -> Response:
    retry_after_seconds = exc.limit.limit.GRANULARITY.seconds
    
    response = JSONResponse(
        status_code=429,
        content={"error": "rate limit exceeded. please try again later.",
                 "retry_after": retry_after_seconds
        },
        headers={"Retry-After": str(retry_after_seconds)}
    )
    
    response = request.app.state.limiter._inject_headers(
        response, request.state.view_rate_limit
    )
    return response

# Shared limit for all message-sending endpoints
message_send_limit = limiter.shared_limit("50/hour", scope="send_messages")


# Custom key function (e.g., using JWT)
def get_user_identifier(request: Request):
    auth = request.headers.get("Authorization")
    if auth and auth.startswith("Bearer "):
        token = auth.split(" ")[1]
        return verify_token(token)
    return get_remote_address(request)

# Global module instances
speech_to_text = SpeechToText()
text_to_speech = TextToSpeech()
image_to_text = ImageToText()

# Router for chat API
chat_router = APIRouter()

# OpenAPI Documentation configuration
def custom_openapi():
    if not chat_router.openapi_schema:
        chat_router.openapi_schema = get_openapi(
            title="AI Companion API",
            version="1.0.0",
            description="""
            AI Companion API provides endpoints for managing chat sessions and interactions with an AI assistant.
            The API supports text, audio, and image-based conversations.
            """,
            routes=chat_router.routes,
        )
        # Add authentication if needed
        chat_router.openapi_schema["info"]["x-logo"] = {
            "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
        }
    return chat_router.openapi_schema

chat_router.openapi = custom_openapi

@chat_router.post("/api/chat-sessions",
    response_model=ChatSession,
    summary="Create a new chat session",
    description="Creates a new chat session and returns the session details",
    response_description="The newly created chat session",
    tags=["Chat Sessions"])
async def create_chat_session(request: Request):
    """Create a new chat session"""
    try:
        user_id = request.state.user_id
        session = ChatSession(title="New Chat", user_id=user_id)
        stored_session = await db.create_chat_session(session)
        return stored_session
    except Exception as e:
        logger.error(f"Error creating chat session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.get("/api/chat-sessions",
    response_model=List[ChatSession],
    summary="Get all chat sessions",
    description="Retrieves all chat sessions for the authenticated user",
    response_description="List of chat sessions",
    tags=["Chat Sessions"])
async def get_chat_sessions(request: Request):
    """Get all chat sessions for the authenticated user"""
    try:
        user_id = request.state.user_id
        sessions = await db.get_chat_sessions(user_id)
        return sessions
    except Exception as e:
        logger.error(f"Error retrieving chat sessions: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.patch("/api/chat-sessions/{session_id}",
    response_model=Dict[str, str],
    summary="Update a chat session",
    description="Updates the specified chat session with new data",
    response_description="Success message",
    tags=["Chat Sessions"])
async def update_chat_session(
    request: Request,
    session_id: str = Path(..., description="The ID of the chat session to update"),
    update_data: Dict = Body(..., description="Data to update in the chat session")
):
    """Update a chat session"""
    try:
        user_id = request.state.user_id
        
        # Get the session first to verify ownership
        session = await db.get_chat_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
            
        if session.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this chat session")
        
        # Filter out any fields that shouldn't be updated
        allowed_fields = {"title"}
        filtered_data = {k: v for k, v in update_data.items() if k in allowed_fields}
        
        if not filtered_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        was_updated = await db.update_chat_session(session_id, filtered_data)
        if not was_updated:
            raise HTTPException(status_code=500, detail="Failed to update chat session")
        return {"status": "success", "message": "Chat session updated"}
    except Exception as e:
        logger.error(f"Error updating chat session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.delete("/api/chat-sessions/{session_id}",
    response_model=Dict[str, str],
    summary="Delete a chat session",
    description="Deletes a chat session and all its associated messages",
    response_description="Success message",
    tags=["Chat Sessions"])
@limiter.limit("1/minute", key_func=get_user_identifier)
async def delete_chat_session(
    request: Request,
    session_id: str = Path(..., description="The ID of the chat session to delete")
):
    """Delete a chat session and all its messages"""
    try:
        user_id = request.state.user_id
        # Get the session first to verify ownership
        session = await db.get_chat_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
        
        if session.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this chat session")
            
        was_deleted = await db.delete_chat_session(session_id)
        if not was_deleted:
            raise HTTPException(status_code=500, detail="Failed to delete chat session")
        return {"status": "success", "message": "Chat session deleted"}
    except Exception as e:
        logger.error(f"Error deleting chat session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.post("/api/chat",
    response_model=Dict,
    summary="Send a message to chat",
    description="""Handle chat interactions with support for text, audio, and image inputs.
    Only one of message, audio, or image should be provided at a time.""",
    response_description="The assistant's response with corresponding content type",
    tags=["Chat"])
@message_send_limit
async def chat_handler(
    request: Request,
    session_id: str = Form(..., description="ID of the chat session"),
    message: Optional[str] = Form(None, description="Text message to send"),
    audio: Optional[UploadFile] = File(None, description="Audio file to process"),
    image: Optional[UploadFile] = File(None, description="Image file to analyze"),
):
    """Handle chat interactions from Next.js frontend"""
    try:
        user_id = request.state.user_id
        
        # Verify session ownership
        session = await db.get_chat_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
            
        if session.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to use this chat session")
        
        # Initialize variables for content and buffers
        content = ""
        audio_buffer = None
        image_bytes = None

        # Process different input types
        if audio:
            audio_data = await audio.read()
            content = await speech_to_text.transcribe(audio_data)
            audio_buffer = audio_data
        elif image:
            image_bytes = await image.read()
            content = await image_to_text.analyze_image(
                image_bytes,
                "Please describe what you see in this image in the context of our conversation."
            )
        elif message:
            content = message
        else:
            raise HTTPException(status_code=400, detail="No valid input provided")        # Create and store user message
        user_message = Message(
            session_id=session_id,
            sender="user",
            content=MessageContent(
                type="conversation" if message else "audio" if audio else "image",
                text=content,
            ),
            audio=base64.b64encode(audio_buffer).decode('utf-8') if audio_buffer else None,
            image=base64.b64encode(image_bytes).decode('utf-8') if image_bytes else None
        )
        stored_user_message = await db.save_message(user_message)

        # Process message through the graph agent
        async with AsyncSqliteSaver.from_conn_string(
            settings.SHORT_TERM_MEMORY_DB_PATH
        ) as short_term_memory:
            graph = graph_builder.compile(checkpointer=short_term_memory)
            await graph.ainvoke(
                {"messages": [HumanMessage(content=content)]},
                {"configurable": {"thread_id": session_id}},
            )

            output_state = await graph.aget_state(
                config={"configurable": {"thread_id": session_id}}
            )

        workflow = output_state.values.get("workflow", "conversation")
        response_message = output_state.values["messages"][-1].content

        # Create and store assistant message
        assistant_message = Message(
            session_id=session_id,
            sender="assistant",
            content=MessageContent(
                type=workflow,
                text=response_message
            )
        )

        # Handle different response types
        if workflow == "audio":
            audio_buffer = output_state.values["audio_buffer"]
            if isinstance(audio_buffer, bytes):
                assistant_message.audio = base64.b64encode(audio_buffer).decode('utf-8')
            elif isinstance(audio_buffer, BytesIO):
                assistant_message.audio = base64.b64encode(audio_buffer.getvalue()).decode('utf-8')
            else:
                raise ValueError("Unsupported audio buffer format")
                
        elif workflow == "image":
            image_path = output_state.values["image_path"]
            with open(image_path, "rb") as f:
                assistant_message.image = base64.b64encode(f.read()).decode('utf-8')

        # Store assistant's response
        stored_assistant_message = await db.save_message(assistant_message)

        # Prepare response data
        response_data = {
            "_id": str(stored_assistant_message.id),
            "timestamp": stored_assistant_message.timestamp,
            "sender": stored_assistant_message.sender,
            "session_id": session_id,
            "content": stored_assistant_message.content.model_dump(),
            "audio": stored_assistant_message.audio,
            "image": stored_assistant_message.image
        }

        return response_data

    except Exception as e:
        logger.error(f"Error processing message: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@chat_router.get("/api/messages/{session_id}",
    response_model=List[Dict],
    summary="Get session messages",
    description="Retrieves all messages for a specific chat session",
    response_description="List of messages with their content and metadata",
    tags=["Messages"])
async def get_session_messages(
    request: Request,
    session_id: str = Path(..., description="The ID of the chat session to get messages from")
):
    """Retrieve all messages for a session"""
    try:
        user_id = request.state.user_id
        
        # Verify session ownership
        session = await db.get_chat_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
            
        if session.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this chat session")
        
        messages = await db.get_messages(session_id)
        return [
            {
                **msg.model_dump(by_alias=True),
                "audio": msg.audio if msg.audio else None,  # Ensure audio is included in response
                "image": msg.image if msg.image else None,  # Ensure image is included in response
            }
            for msg in messages
        ]
    except Exception as e:
        logger.error(f"Error retrieving messages: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@chat_router.get("/api/health",
    response_model=Dict[str, str],
    summary="Health check",
    description="Check if the API is up and running",
    response_description="Service status",
    tags=["System"])
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}