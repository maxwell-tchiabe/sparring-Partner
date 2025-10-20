from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from ai_companion.interfaces.api.routes import chat_router, include_limiter
from fastapi.middleware.cors import CORSMiddleware
from ai_companion.core.auth import verify_token

import argparse
from typing import Generator, Tuple
import fastapi
import numpy as np
import os

app = FastAPI(
    title="AI Companion API",
    description="API for AI Companion application",
    version="1.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs"
)
security = HTTPBearer()

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    # Skip auth for specific endpoints
    # Allow unauthenticated access to health and docs (and their subpaths/static assets)
    public_prefixes = ("/api/health", "/docs", "/redoc", "/openapi.json", "/static", "/favicon.ico")
    if any(request.url.path.startswith(p) for p in public_prefixes):
        return await call_next(request)

    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            # No Authorization provided
            print(f"Auth middleware: missing Authorization header for path {request.url.path}")  # Debug log
            return JSONResponse(
                status_code=401,
                content={"details": "No valid authentication token provided."}
            )

        token = auth_header.split(" ")[1]
        print(f"Token extracted: {token[:10]}...")  # Debug log - only show first 10 chars for security
        
        user_id = verify_token(token)
        print(f"Verify token result - user_id: {user_id}")  # Debug log
        
        if not user_id:
            print("Token verification failed - no user_id returned")  # Debug log
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
include_limiter(app)

