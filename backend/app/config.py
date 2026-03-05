import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "gynecologist_clinic")
JWT_SECRET = os.getenv("JWT_SECRET", "your-super-secret-jwt-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
DOCTOR_PHONE = os.getenv("DOCTOR_PHONE", "9999999999")
DOCTOR_PASSWORD = os.getenv("DOCTOR_PASSWORD", "admin123")
