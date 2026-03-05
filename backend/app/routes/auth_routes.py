from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext

from app.models import (
    SendOTPRequest, VerifyOTPRequest, DoctorLoginRequest,
    TokenResponse, MessageResponse
)
from app.auth import store_otp, verify_otp, create_access_token
from app.database import patients_collection
from app.config import DOCTOR_PHONE, DOCTOR_PASSWORD

router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/send-otp", response_model=MessageResponse)
async def send_otp(request: SendOTPRequest):
    otp = await store_otp(request.phone)
    return {"message": f"OTP sent successfully. [DEV MODE: OTP is {otp}]"}


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp_endpoint(request: VerifyOTPRequest):
    is_valid = await verify_otp(request.phone, request.otp)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )

    patient = await patients_collection.find_one({"phone": request.phone})

    if patient:
        await patients_collection.update_one(
            {"_id": patient["_id"]},
            {"$set": {"verified": True}}
        )
        patient_id = str(patient["_id"])
        name = patient.get("name", "")
    else:
        patient_name = request.name or f"Patient_{request.phone[-4:]}"
        result = await patients_collection.insert_one({
            "name": patient_name,
            "phone": request.phone,
            "verified": True,
            "created_at": datetime.utcnow()
        })
        patient_id = str(result.inserted_id)
        name = patient_name

    token = create_access_token({
        "sub": patient_id,
        "phone": request.phone,
        "role": "patient",
        "name": name
    })

    return {
        "access_token": token,
        "role": "patient",
        "patient_id": patient_id,
        "name": name
    }


@router.post("/doctor-login", response_model=TokenResponse)
async def doctor_login(request: DoctorLoginRequest):
    if request.phone != DOCTOR_PHONE or request.password != DOCTOR_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "sub": "doctor",
        "phone": request.phone,
        "role": "doctor"
    })

    return {
        "access_token": token,
        "role": "doctor"
    }
