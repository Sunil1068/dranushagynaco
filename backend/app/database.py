import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME

client = AsyncIOMotorClient(
    MONGODB_URL, 
    serverSelectionTimeoutMS=5000,
    tls=True,
    tlsCAFile=certifi.where(),
    tlsAllowInvalidCertificates=False
)
db = client[DATABASE_NAME]

patients_collection = db["patients"]
feedback_collection = db["feedback"]
otp_collection = db["otps"]


async def init_db():
    try:
        # Masked URL for logging to verify environment variable is picked up
        masked_url = MONGODB_URL[:15] + "..." if MONGODB_URL else "None"
        print(f"Connecting to MongoDB: {masked_url} (Database: {DATABASE_NAME})")
        
        # Verify connection
        await client.admin.command('ping')
        print(f"Successfully connected to MongoDB at {DATABASE_NAME}")
        
        await patients_collection.create_index("phone", unique=True)
        await feedback_collection.create_index("patient_id")
        await feedback_collection.create_index("created_at")
        await otp_collection.create_index("phone", unique=True)
        await otp_collection.create_index("expires_at", expireAfterSeconds=0)
    except Exception as e:
        print(f"FAILED to connect to MongoDB: {e}")
        # We don't raise the error here to allow the app to at least start (though DB features will fail)
        # This prevents Render from killing the process for 'no open ports'

