# Setup database Supabase — jalankan sekali
# PowerShell: powershell -ExecutionPolicy Bypass -File setup-db.ps1

. "$PSScriptRoot\scripts\refresh-path.ps1"
Set-Location $PSScriptRoot

if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "File .env.local dibuat. Isi SUPABASE_DB_PASSWORD dulu." -ForegroundColor Yellow
}

$envContent = Get-Content ".env.local" -Raw
if ($envContent -notmatch "SUPABASE_DB_PASSWORD=.+" -or $envContent -match "SUPABASE_DB_PASSWORD=\s*$") {
    Write-Host "`nMasukkan Database Password dari Supabase:" -ForegroundColor Cyan
    Write-Host "Dashboard -> Project Settings -> Database -> Database password`n"
    $secure = Read-Host "Password" -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

    if ($envContent -match "SUPABASE_DB_PASSWORD=") {
        $envContent = $envContent -replace "SUPABASE_DB_PASSWORD=.*", "SUPABASE_DB_PASSWORD=$plain"
    } else {
        $envContent += "`nSUPABASE_DB_PASSWORD=$plain`n"
    }
    Set-Content ".env.local" $envContent -NoNewline
}

& "C:\Program Files\nodejs\npm.cmd" run db:setup

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDatabase siap! Restart: npm.cmd run dev" -ForegroundColor Green
}
