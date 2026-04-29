# models/portfolio.py
from pydantic import BaseModel
from typing import Optional

class PortfolioCreate(BaseModel):
    fullName: str
    nickname: str
    graduationYear: int
    Kananame: str
    Sakaname: str
    university: str
    portfolioLink: str
    coverprom: str          # Base64 string จาก frontend
    description: Optional[str] = None   # ← field ใหม่ (ไม่บังคับ)

class PortfolioResponse(BaseModel):
    id: str
    fullName: str
    nickname: str
    graduationYear: int
    Kananame: str
    Sakaname: str
    university: str
    portfolioLink: str
    coverprom: str
    description: Optional[str] = None   # ← field ใหม่
    owner_uid: Optional[str] = None
