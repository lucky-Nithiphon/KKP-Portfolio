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
    coverprom: str          # ← Base64 string จาก frontend

class PortfolioResponse(BaseModel):
    id: str
    fullName: str
    nickname: str
    graduationYear: int
    Kananame: str
    Sakaname: str
    university: str
    portfolioLink: str
    coverprom: str          # ← URL ที่ได้จาก Storage
    owner_uid: Optional[str] = None