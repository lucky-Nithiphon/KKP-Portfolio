# 1. ใช้ Python image ที่มีขนาดเล็กและเสถียร
FROM python:3.10-slim

# 2. ตั้งค่า working directory ใน container
WORKDIR /app

# 3. ป้องกันไม่ให้ Python สร้างไฟล์ .pyc และให้แสดง log ทันที
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 4. ติดตั้ง dependencies ที่จำเป็นสำหรับระบบ (ถ้ามี)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 5. ก๊อปปี้ไฟล์ requirements.txt และติดตั้ง library
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. ก๊อปปี้โค้ดทั้งหมดเข้าเครื่อง
COPY . .

# 7. เปิดพอร์ต 8000 (Koyeb จะมาอ่านพอร์ตนี้)
EXPOSE 8000

# 8. คำสั่งรัน FastAPI ด้วย uvicorn
# ใช้ --host 0.0.0.0 เพื่อให้ภายนอกเข้าถึงได้
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
