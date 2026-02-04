from fastapi import FastAPI, UploadFile, File, HTTPException  # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware  # pyright: ignore[reportMissingImports]
import subprocess
import uuid
import os
import shutil
import uvicorn  # pyright: ignore[reportMissingImports]
import tempfile
import logging
import asyncio

from fastapi import FastAPI, UploadFile, File, HTTPException  # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware  # pyright: ignore[reportMissingImports]
import os
import tempfile
import logging
import asyncio

from api.simplify_text import router as simplify_text_router
from api.pose_generation import router as pose_generation_router
from api.transcribe import router as transcribe_router
from config import config

app = FastAPI()


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/health")
def health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get_cors_origins(),
    allow_credentials=config.CORS_ALLOW_CREDENTIALS,
    allow_methods=config.CORS_ALLOW_METHODS,
    allow_headers=config.CORS_ALLOW_HEADERS,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))

logging.basicConfig(level=getattr(logging, config.LOG_LEVEL))

app.include_router(transcribe_router)
app.include_router(simplify_text_router)
app.include_router(pose_generation_router)

# SignWriting translation (torch + signwriting_translation) is optional for free-tier deploy (<4 GB image).
try:
    from api.signwriting_translation_pytorch import router as signwriting_translation_pytorch_router
    app.include_router(signwriting_translation_pytorch_router)
except ImportError:
    from fastapi import APIRouter
    from pydantic import BaseModel
    _stub = APIRouter()
    class _TextReq(BaseModel):
        text: str
    @_stub.post("/translate_signwriting")
    async def _signwriting_unavailable(_: _TextReq):
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=503,
            content={"detail": "SignWriting translation not available on this deployment (requires signwriting_translation + torch). Use full backend locally or upgrade plan."},
        )
    app.include_router(_stub)

if __name__ == "__main__":
    uvicorn.run(app, host=config.HOST, port=config.PORT, reload=config.DEBUG)
