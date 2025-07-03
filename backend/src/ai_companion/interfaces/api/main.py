from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from ai_companion.interfaces.api.routes import chat_router
from fastapi.middleware.cors import CORSMiddleware
from ai_companion.core.auth import verify_token

import argparse
from typing import Generator, Tuple
import fastapi
import numpy as np
from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings
import os
from ai_companion.fastrtc_voice_stream.process_elevenlabs_tts import process_elevenlabs_tts
from ai_companion.fastrtc_voice_stream.voice_assistant_agent import agent, agent_config


from fastrtc import (
    AlgoOptions,
    ReplyOnPause,
    Stream,
    audio_to_bytes,
    SileroVadOptions,
    get_twilio_turn_credentials
)
from groq import Groq
from loguru import logger

logger.remove()
logger.add(
    lambda msg: print(msg),
    colorize=True,
    format="<green>{time:HH:mm:ss}</green> | <level>{level}</level> | <level>{message}</level>",
)

elevenlabs_client = ElevenLabs(api_key=os.environ.get("ELEVENLABS_API_KEY"))
groq_client = Groq()

def response(
    audio: tuple[int, np.ndarray],
) -> Generator[Tuple[int, np.ndarray], None, None]:
    """
    Process audio input, transcribe it, generate a response using LangGraph, and deliver TTS audio.

    Args:
        audio: Tuple containing sample rate and audio data

    Yields:
        Tuples of (sample_rate, audio_array) for audio playback
    """
    logger.info("🎙️ Received audio input")

    logger.debug("🔄 Transcribing audio...")
    transcript = groq_client.audio.transcriptions.create(
        file=("audio-file.mp3", audio_to_bytes(audio)),
        model="whisper-large-v3-turbo",
        response_format="text",
    )
    logger.info(f'👂 Transcribed: "{transcript}"')

    logger.debug("🧠 Running agent...")
    agent_response = agent.invoke(
        {"messages": [{"role": "user", "content": transcript}]}, config=agent_config
    )
    response_text = agent_response["messages"][-1].content
    logger.info(f'💬 Response: "{response_text}"')

    logger.debug("🔊 Generating speech...")
    """ tts_response = groq_client.audio.speech.create(
        model="playai-tts",
        voice="Celeste-PlayAI",
        response_format="wav",
        input=response_text,
    ) """
    try:
        logger.debug("🔊 Generating speech...")
        tts_stream = elevenlabs_client.text_to_speech.convert(
            voice_id=os.environ.get("ELEVENLABS_VOICE_ID"),
            model_id="eleven_turbo_v2",
            text=response_text,
            voice_settings=VoiceSettings(
                stability=0.5,
                similarity_boost=0.5,
                style=0.0,
                speaker_boost=True
            )
        )
        
        yield from process_elevenlabs_tts(tts_stream)
    except Exception as e:
        logger.error(f"Error generating speech: {e}")
        raise

def create_stream() -> Stream:
    """
    Create and configure a Stream instance with audio capabilities.

    Returns:
        Stream: Configured FastRTC Stream instance
    """

    return Stream(
        modality="audio",
        mode="send-receive",
        rtc_configuration = get_twilio_turn_credentials(),
        handler=ReplyOnPause(
            response,
            algo_options=AlgoOptions(
                audio_chunk_duration=0.5,
                started_talking_threshold=0.1,
                speech_threshold=0.03
            ),
            model_options=SileroVadOptions(
                threshold=0.75,
                min_speech_duration_ms=250,
                min_silence_duration_ms=1500,
                speech_pad_ms=400,
                max_speech_duration_s=15
            ),
        ),
    )

stream = create_stream()


app = FastAPI()

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    # Skip auth for specific endpoints
    if request.url.path in ["/api/health", "/docs", "/redoc", "/openapi.json"]:
        return await call_next(request)

    try:
        auth_header = request.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "No valid authentication token provided"}
            )

        token = auth_header.split(" ")[1]
        
        user_id = verify_token(token)
        
        if not user_id:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid authentication token"}
            )

        # Add user_id to request state
        request.state.user_id = user_id
        return await call_next(request)
    except Exception as e:
        print(f"Auth middleware error: {str(e)}")  # Debug log
        return JSONResponse(
            status_code=401,
            content={"detail": str(e)}
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or your specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat_router)

stream.mount(app)
