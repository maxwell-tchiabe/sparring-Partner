import logging
import base64
from io import BytesIO
from typing import Dict, Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

from ai_companion.graph import graph_builder
from ai_companion.modules.image import ImageToText
from ai_companion.modules.speech import SpeechToText, TextToSpeech
from ai_companion.settings import settings
from ai_companion.database.mongodb import db
from ai_companion.models.message import Message, MessageContent

logger = logging.getLogger(__name__)

# Global module instances
speech_to_text = SpeechToText()
text_to_speech = TextToSpeech()
image_to_text = ImageToText()

# Router for chat API
chat_router = APIRouter()

@chat_router.post("/api/chat")
async def chat_handler(
    session_id: str = Form(...),
    message: Optional[str] = Form(None),
    audio: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
):
    """Handle chat interactions from Next.js frontend"""
    try:
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
            raise HTTPException(status_code=400, detail="No valid input provided")

        # Create and store user message
        user_message = Message(
            session_id=session_id,
            sender="user",
            content=MessageContent(
                type="conversation" if message else "audio" if audio else "image",
                text=content,
                audioFile=audio_buffer if audio else None,
                imageFile=image_bytes if image else None
            )
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
            "id": str(stored_assistant_message.id),
            "timestamp": stored_assistant_message.timestamp.isoformat(),
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


@chat_router.get("/messages/{session_id}")
async def get_session_messages(session_id: str):
    """Retrieve all messages for a session"""
    try:
        messages = await db.get_messages(session_id)
        return [msg.model_dump(by_alias=True) for msg in messages]
    except Exception as e:
        logger.error(f"Error retrieving messages: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@chat_router.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}