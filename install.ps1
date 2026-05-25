# Jalankan: .\install.ps1
# Atau di PowerShell: powershell -ExecutionPolicy Bypass -File install.ps1

. "$PSScriptRoot\scripts\refresh-path.ps1"

Set-Location $PSScriptRoot

Write-Host "Node:" -NoNewline
& "C:\Program Files\nodejs\node.exe" -v
Write-Host "npm:" -NoNewline
& "C:\Program Files\nodejs\npm.cmd" -v

& "C:\Program Files\nodejs\npm.cmd" install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nBerhasil! Jalankan: .\dev.ps1" -ForegroundColor Green
} else {
    Write-Host "`nGagal. Cek pesan error di atas." -ForegroundColor Red
}
