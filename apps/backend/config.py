import os
from typing import List
from dotenv import load_dotenv
import json
from pathlib import Path

# Load environment variables: backend dir first, then SignCast root (for local dev)
# In Docker/Railway the app runs from /app, so only backend .env exists.
backend_dir = Path(__file__).resolve().parent
load_dotenv(backend_dir / ".env")
signcast_dir = backend_dir.parent.parent
if (signcast_dir / ".env").exists():
    load_dotenv(signcast_dir / ".env")

class Config:
    """Configuration class for the SignCast backend"""
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8080"))  # Cloud Run uses 8080 by default
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # API Keys and External Services
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_API_URL: str = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1/chat/completions")
    
    # Pose Generation API
    POSE_API_URL: str = os.getenv("POSE_API_URL", "")
    
    # Whisper Model Configuration
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "base")
    WHISPER_DEVICE: str = os.getenv("WHISPER_DEVICE", "cpu")
    
    # CORS Configuration
    @classmethod
    def get_cors_origins(cls) -> List[str]:
        """Parse CORS origins from environment variable"""
        cors_origins = os.getenv("CORS_ORIGINS", '["*"]')
        try:
            # Try to parse as JSON first
            return json.loads(cors_origins)
        except json.JSONDecodeError:
            # Fallback to comma-separated string
            return [origin.strip() for origin in cors_origins.strip('[]').split(',') if origin.strip()]
    
    CORS_ALLOW_CREDENTIALS: bool = os.getenv("CORS_ALLOW_CREDENTIALS", "true").lower() == "true"
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "DEBUG")
    
    @classmethod
    def validate(cls) -> None:
        """Validate required configuration values"""
        if not cls.GROQ_API_KEY:
            print("Warning: GROQ_API_KEY not set. Text simplification will not work.")
        
        if not cls.POSE_API_URL:
            print("Warning: POSE_API_URL not set. Pose generation will not work.")
    
    @classmethod
    def get_backend_url(cls) -> str:
        """Get the backend URL for frontend configuration"""
        return f"http://{cls.HOST}:{cls.PORT}"

# Create a global config instance
config = Config()

# Validate configuration on import
config.validate() 