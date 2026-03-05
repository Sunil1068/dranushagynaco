from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class ConditionEnum(str, Enum):
    PCOS = "PCOS"
    PREGNANCY = "Pregnancy"
    INFERTILITY = "Infertility"
    MENSTRUAL_DISORDER = "Menstrual Disorder"
    HIGH_RISK_PREGNANCY = "High-Risk Pregnancy"
    OTHER = "Other"


class TreatmentTypeEnum(str, Enum):
    MEDICATION = "Medication"
    SURGERY = "Surgery"
    THERAPY = "Therapy"
    LIFESTYLE = "Lifestyle"
    IVF = "IVF"
    OTHER = "Other"


class RoleEnum(str, Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"


# ---- Request Models ----

class SendOTPRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)


class VerifyOTPRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)
    otp: str = Field(..., min_length=4, max_length=6)
    name: Optional[str] = None


class DoctorLoginRequest(BaseModel):
    phone: str
    password: str


class FeedbackCreate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    age: Optional[int] = Field(None, ge=1, le=120)
    condition: ConditionEnum
    diagnosis: str = Field(..., min_length=1, max_length=500)
    treatment_type: TreatmentTypeEnum
    duration: str = Field(..., min_length=1, max_length=100)
    improvement_level: int = Field(..., ge=1, le=5)
    satisfaction_score: int = Field(..., ge=1, le=5)
    complications: bool = False
    recommend: bool = True
    comments: Optional[str] = Field(None, max_length=1000)


# ---- Response Models ----

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    patient_id: Optional[str] = None
    name: Optional[str] = None


class PatientResponse(BaseModel):
    id: str
    name: str
    phone: str
    verified: bool
    created_at: datetime


class FeedbackResponse(BaseModel):
    id: str
    patient_id: str
    patient_name: Optional[str] = None
    condition: str
    diagnosis: str
    treatment_type: str
    duration: str
    improvement_level: int
    satisfaction_score: int
    complications: bool
    recommend: bool
    comments: Optional[str] = None
    created_at: datetime


class DashboardMetrics(BaseModel):
    total_patients: int
    total_feedback: int
    avg_satisfaction: float
    treatment_success_rate: float
    top_conditions: list
    monthly_growth: list
    satisfaction_distribution: list


class PublicFeedbackResponse(BaseModel):
    id: str
    patient_name: str
    condition: str
    improvement_level: int
    satisfaction_score: int
    comments: Optional[str] = None
    created_at: datetime


class MessageResponse(BaseModel):
    message: str
