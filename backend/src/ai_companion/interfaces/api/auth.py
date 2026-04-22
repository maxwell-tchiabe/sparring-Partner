from fastapi import APIRouter, Response, Body, HTTPException
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)
auth_router = APIRouter(tags=["Authentication"])

class SessionRequest(BaseModel):
    access_token: str

@auth_router.post("/api/auth/session")
async def set_session(response: Response, request_data: SessionRequest):
    """
    Sets the Supabase access token as an HttpOnly cookie.
    """
    try:
        # Set the HttpOnly cookie
        response.set_cookie(
            key="sb-access-token",
            value=request_data.access_token,
            httponly=True,
            secure=False,  # Set to True if using HTTPS. Localhost often works with False.
            samesite="lax",
            path="/",
            max_age=3600 * 24 * 7  # 1 week
        )
        return {"status": "success", "message": "Session cookie set"}
    except Exception as e:
        logger.error(f"Error setting session cookie: {e}")
        raise HTTPException(status_code=500, detail="Failed to set session cookie")

@auth_router.delete("/api/auth/session")
async def clear_session(response: Response):
    """
    Clears the Supabase session cookie.
    """
    try:
        response.delete_cookie(
            key="sb-access-token", 
            path="/",
            httponly=True,
            samesite="lax"
        )
        return {"status": "success", "message": "Session cookie cleared"}
    except Exception as e:
        logger.error(f"Error clearing session cookie: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear session cookie")
