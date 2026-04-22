from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from ai_companion.interfaces.api.routes import chat_router, include_limiter
from ai_companion.interfaces.api.dashboard import dashboard_router
from fastapi.middleware.cors import CORSMiddleware
from ai_companion.core.auth import verify_token
from ai_companion.interfaces.api.auth import auth_router

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

# CORS must be registered FIRST so it wraps every request including preflight
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Dev frontend — extend for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    # Skip auth for specific endpoints
    # Allow unauthenticated access to health, docs, and ALL OPTIONS preflight requests
    if request.method == "OPTIONS":
        return await call_next(request)

    public_prefixes = (
        "/api/health", 
        "/docs", 
        "/redoc", 
        "/openapi.json", 
        "/static", 
        "/favicon.ico",
        "/api/auth/session"  # Allow setting/clearing session without auth
    )
    if any(request.url.path.startswith(p) for p in public_prefixes):
        return await call_next(request)

    try:
        # Prioritize the HttpOnly cookie
        token = request.cookies.get("sb-access-token")
        
        # Fallback to Authorization header
        if not token:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            # No token provided
            print(f"Auth middleware: missing authentication for path {request.url.path}")  # Debug log
            return JSONResponse(
                status_code=401,
                content={"detail": "Authentication required. No valid token found in cookies or headers."}
            )

        print(f"Token identified (source: {'cookie' if request.cookies.get('sb-access-token') else 'header'})")  # Debug log
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
        print(f"Auth middleware error: {str(e)}")  
        return JSONResponse(
            status_code=401,
            content={"detail": str(e)}
        )

# CORS middleware is already registered above (before auth middleware)
# Keeping this section as a reminder but the actual registration is at the top.
app.include_router(chat_router)
app.include_router(dashboard_router)
app.include_router(auth_router)
include_limiter(app)

