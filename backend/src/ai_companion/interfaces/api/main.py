from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from ai_companion.interfaces.api.routes import chat_router
from ai_companion.interfaces.api.dashboard import dashboard_router
from fastapi.middleware.cors import CORSMiddleware
from ai_companion.core.auth import verify_token
from ai_companion.interfaces.api.auth import auth_router
from starlette.middleware.base import BaseHTTPMiddleware

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


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip auth for specific endpoints
        if request.method == "OPTIONS":
            return await call_next(request)

        public_prefixes = (
            "/api/health", 
            "/docs", 
            "/redoc", 
            "/openapi.json", 
            "/static", 
            "/favicon.ico",
            "/api/auth/session",
            "/api/auth/me",
            "/api/debug/ip"
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
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Authentication required. No valid token found in cookies or headers."}
                )

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
            print(f"Auth middleware error: {str(e)}")  
            return JSONResponse(
                status_code=401,
                content={"detail": str(e)}
            )

# Startup event to verify configuration
@app.on_event("startup")
async def startup_event():
    print(f"=== API STARTUP DEBUG ===")
    print(f"ENVIRONMENT: {os.getenv('ENVIRONMENT', 'NOT SET')}")
    print(f"COOKIE_DOMAIN: {os.getenv('COOKIE_DOMAIN', 'NOT SET')}")
    print(f"=========================")

app.add_middleware(AuthMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://evochat.maxwelltbtech.com","https://sparring-partner-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(dashboard_router)
app.include_router(auth_router)
