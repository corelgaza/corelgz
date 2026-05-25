# Perbaiki npm di PowerShell (execution policy)
# Jalankan sekali: powershell -ExecutionPolicy Bypass -File fix-npm.ps1

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path", "User")

Write-Host "Execution policy (CurrentUser):" -ForegroundColor Cyan
Get-ExecutionPolicy -List | Format-Table -AutoSize

Write-Host "Node:" -NoNewline; node -v
Write-Host "npm:" -NoNewline; npm -v

Write-Host "`nSelesai. Sekarang npm install / npm run dev seharusnya jalan." -ForegroundColor Green
