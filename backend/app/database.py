from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

patients_collection = db["patients"]
feedback_collection = db["feedback"]
otp_collection = db["otps"]


async def init_db():
    await patients_collection.create_index("phone", unique=True)
    await feedback_collection.create_index("patient_id")
    await feedback_collection.create_index("created_at")
    await otp_collection.create_index("phone", unique=True)
    await otp_collection.create_index("expires_at", expireAfterSeconds=0)
