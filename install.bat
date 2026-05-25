@echo off
cd /d "%~dp0"
echo Node:
"C:\Program Files\nodejs\node.exe" -v
echo npm:
"C:\Program Files\nodejs\npm.cmd" -v
echo.
"C:\Program Files\nodejs\npm.cmd" install
if %ERRORLEVEL% equ 0 (
    echo.
    echo Berhasil! Jalankan dev.bat atau: npm.cmd run dev
) else (
    echo Gagal. Cek pesan error di atas.
)
pause
