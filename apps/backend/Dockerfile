# Slim image for Railway free tier (<4 GB). No Whisper/PyTorch.
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

ENV HOST=0.0.0.0
EXPOSE 8000

# Railway sets PORT at runtime
CMD ["python", "run_backend.py"]
