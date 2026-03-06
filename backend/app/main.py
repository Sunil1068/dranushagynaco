from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import init_db
from app.routes.auth_routes import router as auth_router
from app.routes.patient_routes import router as patient_router
from app.routes.doctor_routes import router as doctor_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Gynaecologist Clinical API",
    description="Backend API for Gynaecologist Clinical Website",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(patient_router, prefix="/api")
app.include_router(doctor_router, prefix="/api")


@app.api_route("/", methods=["GET", "HEAD"], include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Gynaecologist Clinical API"}
