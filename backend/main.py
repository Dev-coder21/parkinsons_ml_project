from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore

from backend.schemas import ParkinsonsFeatures
from backend.services.prediction import predict_parkinsons


app = FastAPI(
    title="Parkinson's Disease Detection API",
    description="Machine learning API for Parkinson's voice-feature analysis.",
    version="1.0.0",
)


# Allow the React frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Parkinson's Disease Detection API is running."
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/predict")
def predict(features: ParkinsonsFeatures):
    return predict_parkinsons(features.model_dump())