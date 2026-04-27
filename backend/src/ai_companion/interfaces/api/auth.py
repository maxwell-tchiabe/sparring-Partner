from fastapi import APIRouter, Response, Body, HTTPException, Request
from pydantic import BaseModel
import logging
from ai_companion.settings import settings

logger = logging.getLogger(__name__)
auth_router = APIRouter(tags=["Authentication"])

ACCESS_TOKEN_COOKIE = "sb-access-token"
REFRESH_TOKEN_COOKIE = "sb-refresh-token"

class SessionRequest(BaseModel):
    access_token: str
    refresh_token: str

@auth_router.post("/api/auth/session")
async def set_session(response: Response, request_data: SessionRequest):
    """
    Sets the Supabase access and refresh tokens as HttpOnly cookies.
    """
    try:
        is_production = settings.ENVIRONMENT == "production"
        
        cookie_params = {
            "httponly": True,
            "secure": is_production,
            "samesite": "none" if is_production else "lax",
            "path": "/",
            "max_age": 604800
        }

        # Set the Access Token cookie
        response.set_cookie(
            key=ACCESS_TOKEN_COOKIE,
            value=request_data.access_token,
            **cookie_params
        )

        # Set the Refresh Token cookie
        response.set_cookie(
            key=REFRESH_TOKEN_COOKIE,
            value=request_data.refresh_token,
            **cookie_params
        )

        return {"status": "success", "message": "Session cookies set"}
    except Exception as e:
        logger.error(f"Error setting session cookies: {e}")
        raise HTTPException(status_code=500, detail="Failed to set session cookies")

@auth_router.get("/api/auth/me")
async def get_me(request: Request):
    """
    Returns the current session tokens from the HttpOnly cookies.
    This allows the frontend to rehydrate the session without localStorage.
    """
    access_token = request.cookies.get(ACCESS_TOKEN_COOKIE)
    refresh_token = request.cookies.get(REFRESH_TOKEN_COOKIE)
    
    if not access_token or not refresh_token:
        raise HTTPException(status_code=401, detail="No session found")
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

@auth_router.delete("/api/auth/session")
async def clear_session(response: Response):
    """
    Clears the Supabase session cookies.
    """
    try:
        is_production = settings.ENVIRONMENT == "production"
        samesite = "none" if is_production else "lax"
        response.delete_cookie(key=ACCESS_TOKEN_COOKIE, path="/", httponly=True, samesite=samesite, secure=is_production)
        response.delete_cookie(key=REFRESH_TOKEN_COOKIE, path="/", httponly=True, samesite=samesite, secure=is_production)
        
        return {"status": "success", "message": "Session cookies cleared"}
    except Exception as e:
        logger.error(f"Error clearing session cookies: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear session cookies")
