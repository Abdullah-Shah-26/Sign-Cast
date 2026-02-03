# Slim image for Railway free tier (<4 GB). No Whisper/PyTorch.
# Paths are relative to repo root (Railway build context when Dockerfile path is apps/backend/Dockerfile).
FROM python:3.11-slim

WORKDIR /app

COPY apps/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY apps/backend/ .

ENV HOST=0.0.0.0
EXPOSE 8000

# Railway sets PORT at runtime
CMD ["python", "run_backend.py"]
