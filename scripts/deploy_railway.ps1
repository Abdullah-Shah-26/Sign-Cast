# Deploy backend to Railway using path-as-root (avoids Root Directory setting issues).
# Run from SignCast folder: .\scripts\deploy_railway.ps1

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$signCastRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path

Set-Location $signCastRoot
$path = 'apps/backend'
Write-Host "Deploying $path as root to Railway (from $signCastRoot)..."
railway up $path --path-as-root
