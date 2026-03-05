from datetime import datetime
from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.models import FeedbackCreate, FeedbackResponse, PatientResponse, PublicFeedbackResponse
from app.auth import require_patient
from app.database import feedback_collection, patients_collection

router = APIRouter(prefix="/patient", tags=["Patient"])


@router.get("/me", response_model=PatientResponse)
async def get_profile(current_user: dict = Depends(require_patient)):
    patient = await patients_collection.find_one({"_id": ObjectId(current_user["sub"])})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {
        "id": str(patient["_id"]),
        "name": patient["name"],
        "phone": patient["phone"],
        "verified": patient["verified"],
        "created_at": patient["created_at"]
    }


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    feedback: FeedbackCreate,
    current_user: dict = Depends(require_patient)
):
    patient_id = current_user["sub"]

    # Update patient name/age if provided
    if feedback.name:
        await patients_collection.update_one(
            {"_id": ObjectId(patient_id)},
            {"$set": {"name": feedback.name}}
        )

    doc = {
        "patient_id": patient_id,
        "name": feedback.name,
        "age": feedback.age,
        "condition": feedback.condition.value,
        "diagnosis": feedback.diagnosis,
        "treatment_type": feedback.treatment_type.value,
        "duration": feedback.duration,
        "improvement_level": feedback.improvement_level,
        "satisfaction_score": feedback.satisfaction_score,
        "complications": feedback.complications,
        "recommend": feedback.recommend,
        "comments": feedback.comments,
        "created_at": datetime.utcnow()
    }

    result = await feedback_collection.insert_one(doc)

    return {
        "id": str(result.inserted_id),
        "patient_id": patient_id,
        "condition": feedback.condition.value,
        "diagnosis": feedback.diagnosis,
        "treatment_type": feedback.treatment_type.value,
        "duration": feedback.duration,
        "improvement_level": feedback.improvement_level,
        "satisfaction_score": feedback.satisfaction_score,
        "complications": feedback.complications,
        "recommend": feedback.recommend,
        "comments": feedback.comments,
        "created_at": doc["created_at"]
    }


@router.get("/feedback", response_model=list[FeedbackResponse])
async def get_my_feedback(current_user: dict = Depends(require_patient)):
    patient_id = current_user["sub"]
    cursor = feedback_collection.find({"patient_id": patient_id}).sort("created_at", -1)
    results = []
    async for doc in cursor:
        results.append({
            "id": str(doc["_id"]),
            "patient_id": doc["patient_id"],
            "condition": doc["condition"],
            "diagnosis": doc["diagnosis"],
            "treatment_type": doc["treatment_type"],
            "duration": doc["duration"],
            "improvement_level": doc["improvement_level"],
            "satisfaction_score": doc["satisfaction_score"],
            "complications": doc["complications"],
            "recommend": doc["recommend"],
            "comments": doc.get("comments"),
            "created_at": doc["created_at"]
        })
    return results


@router.get("/feedback/public", response_model=List[PublicFeedbackResponse])
async def get_public_feedback():
    """Get approved public feedback (satisfaction >= 3 and recommend == true)"""
    query = {
        "satisfaction_score": {"$gte": 3},
        "recommend": True
    }
    cursor = feedback_collection.find(query).sort("created_at", -1).limit(20)
    results = []
    async for doc in cursor:
        # Get patient name from feedback doc or patients collection
        patient_name = doc.get("name")
        if not patient_name:
            patient = await patients_collection.find_one({"_id": ObjectId(doc["patient_id"])})
            patient_name = patient["name"] if patient else "Anonymous"
        results.append({
            "id": str(doc["_id"]),
            "patient_name": patient_name,
            "condition": doc["condition"],
            "improvement_level": doc["improvement_level"],
            "satisfaction_score": doc["satisfaction_score"],
            "comments": doc.get("comments"),
            "created_at": doc["created_at"]
        })
    return results
