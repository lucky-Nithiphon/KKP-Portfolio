# KKP Portfolio — Portfolio Modal

## ไฟล์ที่ได้รับ

```
src/
├── components/
│   ├── PortfolioModal.tsx   ← component popup ใหม่
│   └── PortfolioModal.css   ← styles ของ popup
└── pages/
    ├── HomePage.tsx          ← อัปเดต (เพิ่ม modal + card click)
    └── AddPortfolioPage.tsx  ← อัปเดต (เพิ่ม description field)

portfolio_model_update.py    ← แก้ backend model (copy ไปวาง)
```

---

## วิธี Install

### 1. วางไฟล์ component ใหม่

```
my-frontend/my-app/src/components/PortfolioModal.tsx
my-frontend/my-app/src/components/PortfolioModal.css
```

> ถ้าโฟลเดอร์ `components/` ยังไม่มี ให้สร้างใหม่ได้เลยครับ

### 2. แทนที่ไฟล์ pages เดิม

```
my-frontend/my-app/src/pages/HomePage.tsx        ← แทนที่
my-frontend/my-app/src/pages/AddPortfolioPage.tsx ← แทนที่
```

### 3. อัปเดต Backend model

เปิดไฟล์ `my-backend/models/portfolio.py` แล้วเพิ่ม field `description`:

```python
class PortfolioCreate(BaseModel):
    ...
    description: Optional[str] = None   # ← เพิ่มบรรทัดนี้

class PortfolioResponse(BaseModel):
    ...
    description: Optional[str] = None   # ← เพิ่มบรรทัดนี้
```

> ไม่ต้อง migrate Firestore เพราะ field นี้เป็น Optional
> Portfolio เก่าที่ไม่มี description จะแสดงข้อความ "ผู้แชร์ยังไม่ได้เพิ่มคำอธิบาย" แทน

---

## สิ่งที่เปลี่ยนแปลง

### HomePage.tsx
- คลิกที่ card หรือปุ่ม → เปิด `PortfolioModal` แทนการเปิด link ทันที
- ปุ่มเปลี่ยนเป็น "ดูรายละเอียด" สำหรับทุกคน
- Hover effect บน card

### AddPortfolioPage.tsx
- เพิ่ม textarea "คำอธิบาย / ฝากถึงรุ่นน้อง"
- ส่ง field `description` ไปยัง backend พร้อมกับข้อมูลอื่น

### PortfolioModal (ใหม่)
- Popup แสดง: รูปหน้าปก, ข้อมูลหลัก, คำอธิบาย
- ถ้า login แล้ว → ปุ่ม "เปิด Portfolio" (เปิด link จริง)
- ถ้ายังไม่ login → ปุ่มล็อค
- ปิดด้วย: ✕ | คลิก overlay | กด Esc
- Responsive รองรับ mobile (slide up จากด้านล่าง)
