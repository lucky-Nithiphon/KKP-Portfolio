from fastapi import Depends, HTTPException, Header
from services.firebase import firebase_auth

async def require_login(authorization: str = Header(...)):
    if not authorization or not authorization.startswith("Bearer"):
        raise HTTPException(
            status_code=401,
            detail="กรุณา Login ก่อนใช้งาน"
        )

    token = authorization.split(" ")[1]

    try:

        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token


    except Exception:
        raise HTTPException(
            status_code=401,
            detail=" Token ไม่ถูกต้องหรือหมดอายุ"
        )