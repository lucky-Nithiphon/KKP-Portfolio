from fastapi import HTTPException, Header
from services.firebase import firebase_auth
from typing import Optional

async def require_login(authorization: Optional[str] = Header(None)):
    # ฟังก์ชันเดิม: บังคับให้ Login (ถ้าไม่มี Token จะพ่น Error)
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="กรุณา Login ก่อนใช้งาน"
        )
    # ... (ส่วนที่เหลือเหมือนเดิม) ...

async def get_optional_user(authorization: Optional[str] = Header(None)):
    # ฟังก์ชันใหม่: ไม่บังคับ Login (ถ้าไม่มี Token จะส่ง None กลับไป)
    if not authorization or not authorization.startswith("Bearer "):
        return None
    
    token = authorization.split(" ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception:
        # ถ้า Token ผิดหรือหมดอายุ ก็ให้เป็น Guest ไปเลย
        return None