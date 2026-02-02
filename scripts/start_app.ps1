$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$backendDir = Join-Path $projectRoot 'apps\backend'
$frontendDir = Join-Path $projectRoot 'apps\frontend'
$backendPython = Join-Path $backendDir '.venv\Scripts\python.exe'

# Pick a PowerShell executable for spawned windows (pwsh on PS7, powershell.exe on Windows PowerShell)
$shellExe = $null
$pwsh = Get-Command pwsh -ErrorAction SilentlyContinue
if ($pwsh) { $shellExe = $pwsh.Source }

if (-not $shellExe) {
  $winPs = Get-Command powershell -ErrorAction SilentlyContinue
  if ($winPs) { $shellExe = $winPs.Source }
}

if (-not $shellExe) {
  $fallback = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
  if (Test-Path $fallback) { $shellExe = $fallback }
}

if (-not $shellExe) {
  throw 'No PowerShell executable found (pwsh/powershell.exe).'
}

Write-Host "Starting SignBridge..." -ForegroundColor Cyan

function Wait-ForUrl {
  param(
    [Parameter(Mandatory=$true)][string]$Url,
    [int]$TimeoutSeconds = 60
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $null = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 2
      return $true
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }
  return $false
}

# Ensure backend venv exists (Python 3.12 is required for the SignWriting model stack)
if (-not (Test-Path $backendPython)) {
  Write-Host "Backend venv missing. Creating it with Python 3.12..." -ForegroundColor Yellow
  $py312 = (& py -3.12 -c "import sys; print(sys.executable)")
  if (-not $py312) {
    throw "Python 3.12 not found. Install it first (winget install Python.Python.3.12)."
  }

  & $py312 -m venv (Join-Path $backendDir '.venv')
  & $backendPython -m pip install -U pip setuptools wheel
  & $backendPython -m pip install -r (Join-Path $backendDir 'requirements.txt')
}

# Start backend (separate window)
Write-Host "Starting backend..." -ForegroundColor Green
Start-Process $shellExe -WorkingDirectory $backendDir -ArgumentList @(
  '-NoExit',
  '-Command',
  "Set-Location `"$backendDir`"; & `"$backendPython`" run_backend.py"
) -PassThru | Out-Null

Write-Host "Waiting for backend (http://127.0.0.1:8000/health)..." -ForegroundColor DarkGray
if (-not (Wait-ForUrl -Url 'http://127.0.0.1:8000/health' -TimeoutSeconds 90)) {
  Write-Host "Backend did not become ready. Check the backend window for errors." -ForegroundColor Red
  Write-Host "Try running manually: cd $backendDir ; .\\.venv\\Scripts\\python.exe run_backend.py" -ForegroundColor DarkGray
  exit 1
}

# Start frontend (separate window)
Write-Host "Starting frontend..." -ForegroundColor Green
$frontendCommand = 'npm run dev'
Start-Process $shellExe -WorkingDirectory $frontendDir -ArgumentList @(
  '-NoExit',
  '-Command',
  "Set-Location `"$frontendDir`"; $frontendCommand"
) -PassThru | Out-Null

Write-Host "Waiting for frontend (http://localhost:5173/)..." -ForegroundColor DarkGray
if (-not (Wait-ForUrl -Url 'http://localhost:5173/' -TimeoutSeconds 90)) {
  Write-Host "Frontend did not become ready. Check the frontend window for errors." -ForegroundColor Red
  Write-Host "Try running manually: cd $frontendDir ; npm run dev" -ForegroundColor DarkGray
  exit 1
}

Start-Sleep -Seconds 1
try {
  # Most reliable way to open default browser on Windows
  Start-Process cmd.exe -ArgumentList @('/c','start','', 'http://localhost:5173/') -WindowStyle Hidden | Out-Null
} catch {
  Write-Host "Could not auto-open browser. Open this manually:" -ForegroundColor Yellow
  Write-Host "http://localhost:5173/" -ForegroundColor Yellow
}

Write-Host "Done." -ForegroundColor Cyan
Write-Host "Backend: http://127.0.0.1:8000 (health: /health)" -ForegroundColor DarkGray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor DarkGray
