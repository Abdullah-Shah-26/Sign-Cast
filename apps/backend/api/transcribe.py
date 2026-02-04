from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import tempfile
import logging
import shutil
import stat
from pathlib import Path
import whisper  # Use OpenAI Whisper
from config import config

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", "..")) 

logging.basicConfig(level=getattr(logging, config.LOG_LEVEL))


def _ensure_ffmpeg_on_path() -> None:
    """Ensure an executable named `ffmpeg` (or `ffmpeg.exe`) is on PATH.

    Whisper shells out to the ffmpeg CLI using the literal command name
    "ffmpeg". On Windows, `imageio-ffmpeg` provides a bundled binary but it is
    not always named `ffmpeg.exe`, so we create a small shim copy with the
    expected name and prepend it to PATH.
    """

    if shutil.which("ffmpeg"):
        return

    try:
        from imageio_ffmpeg import get_ffmpeg_exe

        bundled_exe = Path(get_ffmpeg_exe())
    except Exception as exc:
        raise RuntimeError(
            "ffmpeg not found on PATH and could not locate the bundled ffmpeg from imageio-ffmpeg"
        ) from exc

    shim_dir = Path(PROJECT_ROOT) / ".ffmpeg"
    shim_dir.mkdir(parents=True, exist_ok=True)

    shim_name = "ffmpeg.exe" if os.name == "nt" else "ffmpeg"
    shim_path = shim_dir / shim_name

    # If the bundled binary already has the expected name, we can just add its directory.
    if bundled_exe.name.lower() == shim_name.lower():
        os.environ["PATH"] = str(bundled_exe.parent) + os.pathsep + os.environ.get("PATH", "")
        return

    if not shim_path.exists():
        shutil.copy2(bundled_exe, shim_path)
        if os.name != "nt":
            shim_path.chmod(shim_path.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

    os.environ["PATH"] = str(shim_dir) + os.pathsep + os.environ.get("PATH", "")

@router.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    input_filepath = None
    try:
        # Ensure ffmpeg is available (Whisper relies on it for formats like webm).
        try:
            _ensure_ffmpeg_on_path()
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=(
                    "ffmpeg is required for audio transcription but was not found. "
                    "Install ffmpeg or ensure imageio-ffmpeg is installed and usable. "
                    f"Inner error: {exc}"
                ),
            )

        # Save the uploaded file to a temporary location
        filename = audio.filename or "audio.webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[-1]) as input_file:
            contents = await audio.read()
            if not contents:
                raise HTTPException(status_code=400, detail="Empty audio file uploaded.")
            input_file.write(contents)
            input_filepath = input_file.name
        logging.info(f"Uploaded audio saved to temporary file: {input_filepath}")

        # Load Whisper model using configuration
        model = whisper.load_model(config.WHISPER_MODEL)
        result = model.transcribe(input_filepath)
        transcription = result["text"].strip()

        # Clean transcription to remove timestamps like [00:00:00.000 --> 00:00:04.240]
        import re
        cleaned_lines = []
        for line in transcription.splitlines():
            cleaned_line = re.sub(r"\[\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\]", "", line).strip()
            if cleaned_line:
                cleaned_lines.append(cleaned_line)
        cleaned_transcription = " ".join(cleaned_lines)

        return {"text": cleaned_transcription}

    finally:
        if input_filepath and os.path.exists(input_filepath):
            os.remove(input_filepath)
