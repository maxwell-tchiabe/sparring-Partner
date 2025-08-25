from typing import Optional
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
import os


JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

if not all([ JWT_SECRET]):
    raise ValueError("Missing Supabase environment variables")

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """
    Validates the JWT token and returns the user ID
    """
    try:
        token = credentials.credentials
        # Configure JWT decoding for Supabase tokens
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
            options={
                "verify_aud": False,  # Supabase includes audience claim
            }
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            # Try alternative user ID field used by Supabase
            user_id = payload.get("user_id")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid authentication token - no user ID found")
        return str(user_id)
    except JWTError as je:
        raise HTTPException(status_code=401, detail=f"Invalid authentication token: {str(je)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

def verify_token(token: str) -> Optional[str]:
    """
    Verifies a JWT token and returns the user ID if valid
    """
    try:
        # Configure JWT decoding for Supabase tokens
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
            options={
                "verify_aud": False,  # Supabase includes audience claim
            }
        )
        user_id = payload.get("sub") or payload.get("user_id")
        return str(user_id) if user_id else None
    except JWTError:
        return None
