from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import requests
import urllib.parse

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

def get_wikipedia_summary(title: str):
    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(title)}"
        headers = {"User-Agent": "WeatherGuardianAI/1.0 (contact@weatherguardian.ai)"}
        resp = requests.get(url, headers=headers, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            return {
                "summary": data.get("extract", ""),
                "url": data.get("content_urls", {}).get("desktop", {}).get("page", "")
            }
    except Exception as e:
        print("Error fetching wikipedia summary:", e)
    return None

def get_wikipedia_search_summary(query: str):
    try:
        search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&format=json"
        headers = {"User-Agent": "WeatherGuardianAI/1.0 (contact@weatherguardian.ai)"}
        resp = requests.get(search_url, headers=headers, timeout=5)
        if resp.status_code == 200:
            search_results = resp.json().get("query", {}).get("search", [])
            if search_results:
                best_title = search_results[0]["title"]
                return get_wikipedia_summary(best_title)
    except Exception as e:
        print("Error searching wikipedia:", e)
    return None

@app.post("/api/assistant")
def emergency_assistant(req: ChatRequest):
    msg = req.message.strip()
    msg_lower = msg.lower()
    
    # 1. Direct Emergency Rules (Speedy Responses)
    if "flood" in msg_lower:
        reply = "For floods: Move to higher ground immediately. Do not walk, swim or drive through flood waters. Turn around, don't drown!"
        wiki_info = get_wikipedia_summary("Flood")
        if wiki_info:
            reply += f"\n\n📖 More context from Wikipedia:\n{wiki_info['summary']}\nRead more: {wiki_info['url']}"
        return {"reply": reply}
        
    elif "earthquake" in msg_lower:
        reply = "For earthquakes: Drop, Cover, and Hold on. Stay away from windows, outside doors, and furniture that could fall."
        wiki_info = get_wikipedia_summary("Earthquake")
        if wiki_info:
            reply += f"\n\n📖 More context from Wikipedia:\n{wiki_info['summary']}\nRead more: {wiki_info['url']}"
        return {"reply": reply}
        
    elif "fire" in msg_lower:
        reply = "For fires: Evacuate immediately! Stay low to avoid smoke and use stairs, never elevators. Call emergency services once safe."
        wiki_info = get_wikipedia_summary("Fire")
        if wiki_info:
            reply += f"\n\n📖 More context from Wikipedia:\n{wiki_info['summary']}\nRead more: {wiki_info['url']}"
        return {"reply": reply}
        
    # 2. General Knowledge / Daily Life Search via Wikipedia
    else:
        wiki_info = get_wikipedia_search_summary(msg)
        if wiki_info:
            return {
                "reply": f"🤖 Wikipedia Daily Life Assistant:\n\n{wiki_info['summary']}\n\n🔗 Source: {wiki_info['url']}"
            }
        else:
            return {
                "reply": "I am your daily life & emergency assistant. I tried searching Wikipedia but couldn't find a matching page. Please try asking about weather, health, first aid, or emergency guides."
            }

@app.get("/api/weather_forecast")
def get_weather_forecast():
    return {
        "current": {"temp": 28, "condition": "Cloudy", "humidity": 75},
        "forecast": [
            {"day": "Today", "temp": 28, "risk": "Low"},
            {"day": "Tomorrow", "temp": 32, "risk": "Medium (Heatwave)"},
            {"day": "Day 3", "temp": 24, "risk": "High (Storm Prob: 85%)"}
        ]
    }
