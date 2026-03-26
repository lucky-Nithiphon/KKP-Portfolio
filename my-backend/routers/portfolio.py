from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from models.portfolio import PortfolioCreate, PortfolioResponse
from services.firebase import db, bucket
from dependencies.auth import require_login
import uuid

router = APIRouter()

@router.get("/")
async def get_portfolio(current_user = Depends(require_login)):
    try:

        portfolio_ref = db.collection("portfolios").stream()

        result = []
        for doc in portfolio_ref:
            data = doc.to_dict()
            data["id"] = doc.id
            result.append(data)
        return result

    except Exception as e:
        raise HTTPException(
            status_code= 500,
            detail= "เกิดข้อผิดพลาดในการดึงข้อมูล"
        )
        

@router.post("/")
async def create_portfolio(

    fullName: str = Form(...),
    nickname: str = Form(...),
    graduationYear: int = Form(...),
    Kananame: str = Form(...),
    Sakaname: str = Form(...),
    university: str = Form(...),
    portfolioLink: str = Form(...),
    # UploadFile คือตัวรับไฟล์รูปภาพ
    coverprom: UploadFile = File(...),
    current_user=Depends(require_login)
):
    try:

        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if coverprom.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="รูปภาพต้องเป็นไฟล์ประเภท JPEG, PNG, หรือ WebP"
            )

        image_data = await coverprom.read()
        if len(image_data) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code = 400,
                detail="รูปภาพต้องมีขนาดไม่เกิน 5MB"
            )

        uid = current_user["uid"]
        file_extention = coverprom.filename.split(".")[-1]
        filename = f"portfolio-covers/{uid}/{uuid.uuid4()}.{file_extention}"

        blob = bucket.blob(filename)
        blob.upload_from_string(
            image_data,
            content_type = coverprom.content_type
        )

        blob.make_public()
        image_url = blob.public_url

        doc_ref = db.collection("portfolios").add({
            "fullName": fullName,
            "nickname": nickname,
            "graduationYear": graduationYear,
            "Kananame": Kananame,
            "Sakaname": Sakaname,
            "university": university,
            "portfolioLink": portfolioLink,
            "coverprom": image_url,      # เก็บแค่ URL ไม่ใช่ base64
            "owner_uid": uid,            # รู้ว่าใครเพิ่ม
        })

        return{
            "message": "เพิ่ม portfolio สำเร็จ",
            "id": doc_ref[1].id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail= "เกิดข้อผิดพลาดในการเพิ่ม portfolio"
        )
