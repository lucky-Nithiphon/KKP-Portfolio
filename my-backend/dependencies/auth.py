from fastapi import HTTPException, Header
from services.firebase import firebase_auth
from typing import Optional

async def require_login(authorization: Optional[str] = Header(None)):
    
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="กรุณา Login ก่อนใช้งาน"
        )
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="รูปแบบ Token ไม่ถูกต้อง"
        )
    
    token = authorization.split(" ")[1]
    
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token

    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token หมดอายุแล้ว กรุณา Login ใหม่"
        )
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token ไม่ถูกต้อง"
        )
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="กรุณา Login ก่อนใช้งาน"
        )