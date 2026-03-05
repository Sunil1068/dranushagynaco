from datetime import datetime, timedelta
from typing import Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, Query

from app.models import FeedbackResponse, DashboardMetrics
from app.auth import require_doctor
from app.database import feedback_collection, patients_collection

router = APIRouter(prefix="/doctor", tags=["Doctor Dashboard"])


@router.get("/metrics", response_model=DashboardMetrics)
async def get_dashboard_metrics(current_user: dict = Depends(require_doctor)):
    total_patients = await patients_collection.count_documents({})
    total_feedback = await feedback_collection.count_documents({})

    # Average satisfaction
    pipeline_sat = [
        {"$group": {"_id": None, "avg_sat": {"$avg": "$satisfaction_score"}}}
    ]
    sat_result = await feedback_collection.aggregate(pipeline_sat).to_list(1)
    avg_satisfaction = round(sat_result[0]["avg_sat"], 2) if sat_result else 0.0

    # Treatment success rate (improvement >= 4)
    success_count = await feedback_collection.count_documents({"improvement_level": {"$gte": 4}})
    treatment_success_rate = round((success_count / total_feedback * 100), 1) if total_feedback > 0 else 0.0

    # Top conditions
    pipeline_cond = [
        {"$group": {"_id": "$condition", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    conditions = await feedback_collection.aggregate(pipeline_cond).to_list(10)
    top_conditions = [{"name": c["_id"], "count": c["count"]} for c in conditions]

    # Monthly patient growth (last 12 months)
    twelve_months_ago = datetime.utcnow() - timedelta(days=365)
    pipeline_growth = [
        {"$match": {"created_at": {"$gte": twelve_months_ago}}},
        {"$group": {
            "_id": {
                "year": {"$year": "$created_at"},
                "month": {"$month": "$created_at"}
            },
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    growth = await patients_collection.aggregate(pipeline_growth).to_list(12)
    monthly_growth = [
        {"month": f"{g['_id']['year']}-{g['_id']['month']:02d}", "count": g["count"]}
        for g in growth
    ]

    # Satisfaction distribution
    pipeline_sat_dist = [
        {"$group": {"_id": "$satisfaction_score", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    sat_dist = await feedback_collection.aggregate(pipeline_sat_dist).to_list(5)
    satisfaction_distribution = [
        {"score": s["_id"], "count": s["count"]} for s in sat_dist
    ]

    return {
        "total_patients": total_patients,
        "total_feedback": total_feedback,
        "avg_satisfaction": avg_satisfaction,
        "treatment_success_rate": treatment_success_rate,
        "top_conditions": top_conditions,
        "monthly_growth": monthly_growth,
        "satisfaction_distribution": satisfaction_distribution
    }


@router.get("/feedback", response_model=list[FeedbackResponse])
async def get_all_feedback(
    condition: Optional[str] = Query(None),
    treatment_type: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user: dict = Depends(require_doctor)
):
    query = {}

    if condition:
        query["condition"] = condition
    if treatment_type:
        query["treatment_type"] = treatment_type
    if start_date or end_date:
        date_filter = {}
        if start_date:
            date_filter["$gte"] = datetime.fromisoformat(start_date)
        if end_date:
            date_filter["$lte"] = datetime.fromisoformat(end_date)
        if date_filter:
            query["created_at"] = date_filter

    cursor = feedback_collection.find(query).sort("created_at", -1)
    results = []
    async for doc in cursor:
        patient = await patients_collection.find_one({"_id": ObjectId(doc["patient_id"])})
        patient_name = patient["name"] if patient else "Unknown"
        results.append({
            "id": str(doc["_id"]),
            "patient_id": doc["patient_id"],
            "patient_name": patient_name,
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


@router.get("/alerts/low-satisfaction", response_model=list[FeedbackResponse])
async def get_low_satisfaction(current_user: dict = Depends(require_doctor)):
    cursor = feedback_collection.find({"satisfaction_score": {"$lt": 2}}).sort("created_at", -1)
    results = []
    async for doc in cursor:
        patient = await patients_collection.find_one({"_id": ObjectId(doc["patient_id"])})
        patient_name = patient["name"] if patient else "Unknown"
        results.append({
            "id": str(doc["_id"]),
            "patient_id": doc["patient_id"],
            "patient_name": patient_name,
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


@router.get("/alerts/complications", response_model=list[FeedbackResponse])
async def get_complications(current_user: dict = Depends(require_doctor)):
    cursor = feedback_collection.find({"complications": True}).sort("created_at", -1)
    results = []
    async for doc in cursor:
        patient = await patients_collection.find_one({"_id": ObjectId(doc["patient_id"])})
        patient_name = patient["name"] if patient else "Unknown"
        results.append({
            "id": str(doc["_id"]),
            "patient_id": doc["patient_id"],
            "patient_name": patient_name,
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


@router.get("/patients")
async def get_all_patients(current_user: dict = Depends(require_doctor)):
    cursor = patients_collection.find({}).sort("created_at", -1)
    results = []
    async for doc in cursor:
        results.append({
            "id": str(doc["_id"]),
            "name": doc["name"],
            "phone": doc["phone"],
            "verified": doc["verified"],
            "created_at": doc["created_at"]
        })
    return results
