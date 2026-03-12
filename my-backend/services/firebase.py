import firebase_admin
from firebase_admin import credentials, firestore, auth
from dotenv import load_dotenv
import os

# โหลดค่าจาก .env
load_dotenv()

# อ่าน path ของ serviceAccountKey.json จาก .env
credential_path = os.getenv("FIREBASE_CREDENTIAL_PATH")
storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET")


# เชื่อมต่อ Firebase ด้วย serviceAccountKey.json
cred = credentials.Certificate(credential_path)
firebase_admin.initialize_app(cred, {"storageBucket": storage_bucket})

# สร้างตัวเชื่อมต่อ Firestore และ Auth
db = firestore.client()
firebase_auth = auth
bucket = storage.bucket()