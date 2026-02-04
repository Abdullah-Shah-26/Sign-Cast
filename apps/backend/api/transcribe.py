from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import tempfile
import logging
import re
import stat
from pathlib import Path
import requests
import shutil
from config import config

router = APIRouter()

BACKEND_DIR = Path(__file__).resolve().parents[1]

GROQ_TRANSCRIPTIONS_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
GROQ_WHISPER_MODEL = "whisper-large-v3-turbo"

logging.basicConfig(level=getattr(logging, config.LOG_LEVEL))


def _ensure_ffmpeg_on_path() -> None:
    """Ensure Whisper can invoke the ffmpeg CLI.

    Whisper calls the literal command name `ffmpeg`. On Windows, the binary
    provided by `imageio-ffmpeg` isn't always named `ffmpeg.exe`, so we create
    a shim copy with the expected name and add it to PATH.
    """

    if shutil.which("ffmpeg"):
        return

    try:
        from imageio_ffmpeg import get_ffmpeg_exe

        bundled_exe = Path(get_ffmpeg_exe())
    except Exception as exc:
        raise RuntimeError(
            "ffmpeg not found on PATH and could not locate bundled ffmpeg from imageio-ffmpeg"
        ) from exc

    shim_dir = BACKEND_DIR / ".ffmpeg"
    shim_dir.mkdir(parents=True, exist_ok=True)

    shim_name = "ffmpeg.exe" if os.name == "nt" else "ffmpeg"
    shim_path = shim_dir / shim_name

    if bundled_exe.name.lower() == shim_name.lower():
        os.environ["PATH"] = str(bundled_exe.parent) + os.pathsep + os.environ.get("PATH", "")
        return

    if not shim_path.exists():
        shutil.copy2(bundled_exe, shim_path)
        if os.name != "nt":
            shim_path.chmod(
                shim_path.stat().st_mode
                | stat.S_IXUSR
                | stat.S_IXGRP
                | stat.S_IXOTH
            )

    os.environ["PATH"] = str(shim_dir) + os.pathsep + os.environ.get("PATH", "")


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

    _ensure_ffmpeg_on_path()

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
            except Exception as exc:
                raise HTTPException(
                    status_code=500,
                    detail=f"Local transcription failed: {exc}",
                )
        return {"text": transcription}
    finally:
        if input_filepath and os.path.exists(input_filepath):
            os.remove(input_filepath)
