from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from models.portfolio import PortfolioCreate, PortfolioResponse
from services.firebase import db, bucket
from dependencies.auth import get_optional_user
import uuid

router = APIRouter()

@router.get("/")
async def get_portfolios():
    try:
        portfolios_ref = db.collection("portfolios").stream()
        result = []
        for doc in portfolios_ref:
            data = doc.to_dict()
            data["id"] = doc.id
            result.append(data)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="เกิดข้อผิดพลาดในการดึงข้อมูล"
        )

@router.post("/")
async def create_portfolio(
    portfolio: PortfolioCreate, # รับเป็น JSON ตาม Model ที่มีอยู่
    current_user=Depends(get_optional_user)
):
    try:
        # Debug: ตรวจสอบข้อมูลที่ได้รับ
        print(f"🔍 Debug: Received portfolio data:")
        print(f"   - fullName: {portfolio.fullName}")
        print(f"   - coverprom type: {type(portfolio.coverprom)}")
        print(f"   - coverprom length: {len(portfolio.coverprom) if portfolio.coverprom else 0}")
        print(f"   - coverprom starts with: {portfolio.coverprom[:50] if portfolio.coverprom else 'None'}...")
        
        # จัดการ UID (ถ้าไม่ได้ Login ให้ใช้ 'guest')
        uid = current_user["uid"] if current_user else "guest"
        
        # เตรียมข้อมูลเพื่อบันทึกลง Firestore
        portfolio_data = portfolio.dict()
        portfolio_data["owner_uid"] = uid
        
        # บันทึกลง Firestore (coverprom จะเป็น Base64 string ที่ส่งมาจาก React)
        doc_ref = db.collection("portfolios").add(portfolio_data)

        return{
            "message": "เพิ่ม portfolio สำเร็จ (บันทึกแบบ Base64)",
            "id": doc_ref[1].id
        }
    except Exception as e:
        print(f"❌ Error detailed: {str(e)}") # พิมพ์ลง Terminal ของ Python
        raise HTTPException(
            status_code=500,
            detail= f"เกิดข้อผิดพลาด: {str(e)}" # ส่งกลับไปแสดงที่หน้าเว็บ
        )
