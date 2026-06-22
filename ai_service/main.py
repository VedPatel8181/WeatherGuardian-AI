from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="WeatherGuardian AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "WeatherGuardian AI Service"}

class ChatRequest(BaseModel):
    message: str

@app.post("/api/assistant")
def emergency_assistant(req: ChatRequest):
    # Mock Offline Rule-Based NLP Chatbot
    msg = req.message.lower()
    if "flood" in msg:
        return {"reply": "For floods: Move to higher ground immediately. Do not walk, swim or drive through flood waters. Turn around, don't drown!"}
    elif "earthquake" in msg:
        return {"reply": "For earthquakes: Drop, Cover, and Hold on. Stay away from windows, outside doors, and furniture that could fall."}
    elif "fire" in msg:
        return {"reply": "For fires: Evacuate immediately! Stay low to avoid smoke and use stairs, never elevators. Call emergency services once safe."}
    else:
        return {"reply": "I am your offline emergency assistant. Please specify your emergency: flood, earthquake, or fire for specific instructions."}

@app.get("/api/weather_forecast")
def get_weather_forecast():
    # Mock AI Forecast based on synthetic data
    return {
        "current": {"temp": 28, "condition": "Cloudy", "humidity": 75},
        "forecast": [
            {"day": "Today", "temp": 28, "risk": "Low"},
            {"day": "Tomorrow", "temp": 32, "risk": "Medium (Heatwave)"},
            {"day": "Day 3", "temp": 24, "risk": "High (Storm Prob: 85%)"}
        ]
    }
