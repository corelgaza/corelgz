@echo off
cd /d "%~dp0"
if not exist "node_modules\" (
    echo node_modules belum ada. Jalankan install.bat dulu.
    pause
    exit /b 1
)
"C:\Program Files\nodejs\npm.cmd" run dev
