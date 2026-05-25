# Jalankan: .\dev.ps1

. "$PSScriptRoot\scripts\refresh-path.ps1"

Set-Location $PSScriptRoot

if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules belum ada. Jalankan dulu: .\install.ps1" -ForegroundColor Yellow
    exit 1
}

& "C:\Program Files\nodejs\npm.cmd" run dev
