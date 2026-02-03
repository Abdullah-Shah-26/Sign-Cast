from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import tempfile
import logging
import re
import requests
from config import config

router = APIRouter()

GROQ_TRANSCRIPTIONS_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
GROQ_WHISPER_MODEL = "whisper-large-v3-turbo"

logging.basicConfig(level=getattr(logging, config.LOG_LEVEL))


def _transcribe_via_groq(file_path: str, filename: str) -> str:
    """Use Groq Whisper API for transcription (no local Whisper needed)."""
    name = filename or "audio.wav"
    with open(file_path, "rb") as f:
        content = f.read()
    files = {"file": (name, content, "audio/wav")}
    data = {"model": GROQ_WHISPER_MODEL, "response_format": "text"}
    resp = requests.post(
        GROQ_TRANSCRIPTIONS_URL,
        headers={"Authorization": f"Bearer {config.GROQ_API_KEY}"},
        files=files,
        data=data,
        timeout=60,
    )
    resp.raise_for_status()
    return (resp.text or "").strip()


def _transcribe_via_local_whisper(file_path: str) -> str:
    """Use local openai-whisper (for dev when GROQ_API_KEY not set)."""
    import whisper
    import shutil
    if shutil.which("ffmpeg") is None:
        try:
            from imageio_ffmpeg import get_ffmpeg_exe
            ffmpeg_exe = get_ffmpeg_exe()
            ffmpeg_dir = os.path.dirname(ffmpeg_exe)
            os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")
        except Exception:
            pass
    model = whisper.load_model(config.WHISPER_MODEL)
    result = model.transcribe(file_path)
    text = result["text"].strip()
    cleaned_lines = []
    for line in text.splitlines():
        cleaned = re.sub(r"\[\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\]", "", line).strip()
        if cleaned:
            cleaned_lines.append(cleaned)
    return " ".join(cleaned_lines)


@router.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    input_filepath = None
    try:
        contents = await audio.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty audio file uploaded.")
        suffix = os.path.splitext(audio.filename or "")[-1] or ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(contents)
            input_filepath = tmp.name
        logging.info(f"Transcribing uploaded file: {input_filepath}")

        if config.GROQ_API_KEY:
            transcription = _transcribe_via_groq(input_filepath, audio.filename or "audio.wav")
        else:
            try:
                transcription = _transcribe_via_local_whisper(input_filepath)
            except ImportError:
                raise HTTPException(
                    status_code=503,
                    detail="Transcription requires GROQ_API_KEY (set in Variables) or install openai-whisper for local dev.",
                )
        return {"text": transcription}
    finally:
        if input_filepath and os.path.exists(input_filepath):
            os.remove(input_filepath)
