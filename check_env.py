
import os
from pathlib import Path
import sys

backend_path = Path(r"c:\Users\Abdullah\Sign-Bridge\SignCast\apps\backend")
sys.path.append(str(backend_path))

from config import config

print(f"DEBUG: {config.DEBUG}")
print(f"PORT: {config.PORT}")
print(f"GROQ_API_KEY: {config.GROQ_API_KEY[:5]}... if set else 'Empty'")
print(f"GROQ_API_URL: {config.GROQ_API_URL}")

with open("env_check.txt", "w") as f:
    f.write(f"PORT: {config.PORT}\n")
    f.write(f"GROQ_API_KEY_SET: {bool(config.GROQ_API_KEY)}\n")
    f.write(f"GROQ_API_KEY_VAL: {config.GROQ_API_KEY}\n")
