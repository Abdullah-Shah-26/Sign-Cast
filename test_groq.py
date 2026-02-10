
import sys
import os
from pathlib import Path

# Add backend to path to import config
backend_path = Path(r"c:\Users\Abdullah\Sign-Bridge\SignCast\apps\backend")
sys.path.append(str(backend_path))

try:
    from config import config
    import requests
    
    with open("test_results.txt", "w") as f:
        f.write(f"Testing Groq API with key: {config.GROQ_API_KEY[:6]}...{config.GROQ_API_KEY[-4:]}\n")
        f.write(f"URL: {config.GROQ_API_URL}\n")
        
        headers = {
            "Authorization": f"Bearer {config.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama3-70b-8192",
            "messages": [
                {"role": "user", "content": "Say hello"}
            ]
        }
        
        try:
            response = requests.post(config.GROQ_API_URL, json=payload, headers=headers, timeout=10)
            f.write(f"Status Code: {response.status_code}\n")
            f.write(f"Response: {response.text}\n")
        except Exception as e:
            f.write(f"Request Error: {e}\n")

except Exception as e:
    with open("test_results.txt", "a") as f:
        f.write(f"Outer Error: {e}\n")
