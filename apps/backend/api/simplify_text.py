import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config import config

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/simplify_text")
async def simplify_text(request: TextRequest):
    # Offline-friendly fallback: if no real key is configured, just return the original text.
    if (not config.GROQ_API_KEY) or (config.GROQ_API_KEY.strip().lower() in {"", "your_groq_api_key_here"}):
        return {"simplified_text": request.text}
    headers = {
        "Authorization": f"Bearer {config.GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that simplifies English text for better translation into Sign Language. Return ONLY the simplified text, no preamble or formatting."},
            {"role": "user", "content": f"Simplify this text: {request.text}"}
        ]
    }
    try:
        response = requests.post(config.GROQ_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        simplified_text = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
        return {"simplified_text": simplified_text}
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Groq API request failed: {str(e)}")
