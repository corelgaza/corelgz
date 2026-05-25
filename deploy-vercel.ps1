# Deploy ke Vercel dari folder proyek
# Jalankan: powershell -ExecutionPolicy Bypass -File deploy-vercel.ps1

. "$PSScriptRoot\scripts\refresh-path.ps1"
Set-Location $PSScriptRoot

Write-Host "Build production..." -ForegroundColor Cyan
& "C:\Program Files\nodejs\npm.cmd" run build
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`nDeploy ke Vercel (login browser mungkin terbuka)..." -ForegroundColor Cyan
& "C:\Program Files\nodejs\npx.cmd" vercel --prod

Write-Host "`nSetelah deploy, tambahkan Environment Variables di Vercel Dashboard:" -ForegroundColor Yellow
Write-Host "  NEXT_PUBLIC_SUPABASE_URL"
Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
Write-Host "  SUPABASE_SERVICE_ROLE_KEY"
Write-Host "  NEXT_PUBLIC_SITE_URL  (URL production, mis. https://xxx.vercel.app)"
