from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from ai_companion.interfaces.api.routes import chat_router
from fastapi.middleware.cors import CORSMiddleware
from ai_companion.core.auth import verify_token
from ai_companion.fastrtc_voice_stream.simple_math_agent import agent, agent_config

import argparse
from typing import Generator, Tuple
import fastapi
import numpy as np


from fastrtc import (
    AlgoOptions,
    ReplyOnPause,
    Stream,
    get_stt_model,
    get_tts_model,
)
from groq import Groq
from loguru import logger

logger.remove()
logger.add(
    lambda msg: print(msg),
    colorize=True,
    format="<green>{time:HH:mm:ss}</green> | <level>{level}</level> | <level>{message}</level>",
)

stt_model = get_stt_model()
tts_model = get_tts_model()

def response(audio: tuple[int, np.ndarray]):
    prompt = stt_model.stt(audio)

    logger.debug("🧠 Running agent...")
    agent_response = agent.invoke(
        {"messages": [{"role": "user", "content": prompt}]}, config=agent_config
    )
    response_text = agent_response["messages"][-1].content

    for audio_chunk in tts_model.stream_tts_sync(response_text):
        logger.debug("🔊 Generating speech...")
        yield audio_chunk

def create_stream() -> Stream:
    """
    Create and configure a Stream instance with audio capabilities.

    Returns:
        Stream: Configured FastRTC Stream instance
    """

    return Stream(
        modality="audio",
        mode="send-receive",
        handler=ReplyOnPause(
            response,
            algo_options=AlgoOptions(
                speech_threshold=0.5,
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
