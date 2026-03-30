from fastapi import APIRouter, HTTPException
from models.user import UserRegister, UserLogin
from services.firebase import firebase_auth, db
import bcrypt

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    try:
        # 1. การ Hash: แปลง Password จาก User (String) ให้เป็น Bytes ก่อน
        # แล้วใช้ gensalt() เพื่อสร้างค่าสุ่มมาผสม
        hashed_password = bcrypt.hashpw(
            user.password.encode("utf-8"),
            bcrypt.gensalt(rounds=12) # rounds คือจำนวนรอบความซับซ้อน ยิ่งเยอะยิ่งปลอดภัยแต่ช้าลง
        )

        # 2. สร้าง User ใน Firebase (ตัวนี้ Firebase จะ hash ของมันเองแยกต่างหาก)
        firebase_User = firebase_auth.create_user(
            email = user.email,
            password = user.password,
            display_name = user.display_name
        )

        # 3. เก็บ Hash ลง Firestore (เราต้อง decode เป็น string ก่อนเก็บ)
        db.collection("users").document(firebase_User.uid).set({
            "email": user.email,
            "display_name": user.display_name,
            "hashed_password": hashed_password.decode("utf-8")
        })

        return{
            "message": "สมัครสมาชิกสำเร็จ",
            "uid": firebase_User.uid
        }
    except firebase_auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=400,
            detail= "Email นี้ถูกใช้แล้ว"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    
@router.post("/login")
async def login(user: UserLogin):
    try:
        # หา User จาก Email
        firebase_user = firebase_auth.get_user_by_email(user.email)
        
        # ดึง Hash ที่เราเคยเก็บไว้ใน Firestore ออกมา
        user_doc = db.collection("users").document(firebase_user.uid).get()
        if not user_doc.exists:
            raise HTTPException(
                status_code=404,
                detail="ไม่พบข้อมูลผู้ใช้ในระบบ"
            )
        user_data = user_doc.to_dict()

        # 4. การตรวจสอบ (Verification):
        # ใช้ bcrypt.checkpw(ของที่ส่งมาใหม่, ของที่เก็บอยู่ใน DB)
        password_match = bcrypt.checkpw(
            user.password.encode("utf-8"),          # รหัสที่ผู้ใช้พิมพ์มา (Bytes)
            user_data["hashed_password"].encode("utf-8") # รหัส Hash ใน DB (Bytes)
        )

        if not password_match:
            raise HTTPException(
                status_code= 401,
                detail= "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
            )
        custom_token = firebase_auth.create_custom_token(firebase_user.uid)

        return{
            "message": "เข้าสู่ระบบสำเร็จ",
            "token": custom_token.decode("utf-8") if isinstance(custom_token, bytes) else custom_token,
            "uid": firebase_user.uid,
            "display_name": firebase_user.display_name,
            "email": firebase_user.email
        }

    except HTTPException:
        raise
    
    except firebase_auth.UserNotFoundError:
         raise HTTPException(
            status_code= 401,
            detail= "ไม่พบอีเมลนี้ในระบบ"
         )

    except Exception as e:
        raise HTTPException(
            status_code = 401,
            detail= "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
        )