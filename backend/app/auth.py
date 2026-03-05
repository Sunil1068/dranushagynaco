import random
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from app.database import otp_collection, patients_collection

security = HTTPBearer()

OTP_STORE: dict = {}


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    return payload


async def require_doctor(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "doctor":
        raise HTTPException(status_code=403, detail="Doctor access required")
    return current_user


async def require_patient(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "patient":
        raise HTTPException(status_code=403, detail="Patient access required")
    return current_user


def generate_otp() -> str:
    return str(random.randint(1000, 9999))


async def store_otp(phone: str) -> str:
    otp = generate_otp()
    OTP_STORE[phone] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=5),
    }
    # In production, send OTP via SMS gateway
    print(f"[SIMULATED OTP] Phone: {phone}, OTP: {otp}")
    return otp


async def verify_otp(phone: str, otp: str) -> bool:
    stored = OTP_STORE.get(phone)
    if not stored:
        return False
    if stored["expires_at"] < datetime.utcnow():
        del OTP_STORE[phone]
        return False
    if stored["otp"] != otp:
        return False
    del OTP_STORE[phone]
    return True
