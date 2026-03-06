import os
import sys
from dotenv import load_dotenv

# Try to find .env in current and parent dirs
load_dotenv()

# Debug: Print available environment variable names (not values) if MONGODB_URL is missing
_tmp_url = os.getenv("MONGODB_URL")
if not _tmp_url:
    print("DEBUG: MONGODB_URL is MISSING from environment.")
    print(f"DEBUG: Available keys: {list(os.environ.keys())}")
else:
    print(f"DEBUG: MONGODB_URL found in environment (starting with {_tmp_url[:10]}...)")

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "gynecologist_clinic")
JWT_SECRET = os.getenv("JWT_SECRET", "your-super-secret-jwt-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
DOCTOR_PHONE = os.getenv("DOCTOR_PHONE", "9999999999")
DOCTOR_PASSWORD = os.getenv("DOCTOR_PASSWORD", "admin123")

