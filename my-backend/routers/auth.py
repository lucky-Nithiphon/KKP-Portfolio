from fastapi import APIRouter, HTTPException
from models.user import UserRegister, UserLogin
from services.firebase import firebase_auth, db
import bcrypt

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    try:
        
        hashed_password = bcrypt.hashpw(
            user.password.encode("utf-8"),
            bcrypt.gensalt()
        )


        firebase_User = firebase_auth.create_user(
            email = user.email,
            password = user.password,
            display_name = user.display_name
        )

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
        firebase_user = firebase_auth.get_user_by_email(user.email)
        
        user_doc = db.collection("users").document(firebase_user.uid).get()
        user_data = user_doc.to_dict()
        password_match = bcrypt.checkpw(
            user.password.encode("utf-8"),
            user_data["hashed_password"].encode("utf-8")
        )
        if not password_match:
            raise HTTPException(
                status_code= 401,
                detail= "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
            )
        custom_token = firebase_auth.create_custom_token(firebase_user.uid)

        return{
            "message": "เข้าสู่ระบบสำเร็จ",
            "token": custom_token.decode("utf-8"),
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