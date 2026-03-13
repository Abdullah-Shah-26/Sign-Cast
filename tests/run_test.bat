@echo off
setlocal

set "PYTHON=..\apps\backend\.venv\Scripts\python.exe"

if not exist "%PYTHON%" (
  echo Backend venv python not found: %PYTHON%
  echo Create it in apps\backend\.venv and install deps first.
  exit /b 1
)

if not exist "test_groq.py" (
  echo Groq test script not found: test_groq.py
  exit /b 1
)

"%PYTHON%" test_groq.py

endlocal
