Add-Type -AssemblyName System.Drawing

$w = 1080
$h = 1920
$out = Join-Path $PSScriptRoot "..\public\images\wa-status-v2.jpg"
$coverPath = Join-Path $PSScriptRoot "..\public\images\cover-hidup-di-pesantren.png"
$shareUrl = "https://corelgz.hwstudio.id/share"
$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=$([uri]::EscapeDataString($shareUrl))"

$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$top = [System.Drawing.Color]::FromArgb(27, 67, 50)
$bottom = [System.Drawing.Color]::FromArgb(45, 106, 79)
$brushBg = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
  [System.Drawing.Rectangle]::new(0, 0, $w, $h)), $top, $bottom, 90
$g.FillRectangle($brushBg, 0, 0, $w, $h)

$white = [System.Drawing.Color]::White
$gold = [System.Drawing.Color]::FromArgb(184, 134, 11)
$mint = [System.Drawing.Color]::FromArgb(216, 243, 220)

$fontBadge = New-Object System.Drawing.Font("Segoe UI", 28, [System.Drawing.FontStyle]::Bold)
$fontTitle = New-Object System.Drawing.Font("Segoe UI", 52, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Segoe UI", 28, [System.Drawing.FontStyle]::Regular)
$fontFeat = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Regular)
$fontUrl = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$fontSmall = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Regular)
$fontQrHint = New-Object System.Drawing.Font("Segoe UI", 30, [System.Drawing.FontStyle]::Bold)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

$g.DrawString("SANTRI JOURNEY", $fontBadge, (New-Object System.Drawing.SolidBrush $mint),
  (New-Object System.Drawing.RectangleF 80, 100, 920, 50), $sf)
$g.DrawString("Kehidupan Santri di", $fontSub, (New-Object System.Drawing.SolidBrush $white),
  (New-Object System.Drawing.RectangleF 60, 170, 960, 40), $sf)
$g.DrawString("Pesantren Sukahideng", $fontTitle, (New-Object System.Drawing.SolidBrush $white),
  (New-Object System.Drawing.RectangleF 40, 210, 1000, 140), $sf)

$cover = [System.Drawing.Image]::FromFile($coverPath)
$imgRect = New-Object System.Drawing.Rectangle 90, 360, 900, 620
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$radius = 28
$path.AddArc($imgRect.X, $imgRect.Y, $radius * 2, $radius * 2, 180, 90)
$path.AddArc($imgRect.Right - $radius * 2, $imgRect.Y, $radius * 2, $radius * 2, 270, 90)
$path.AddArc($imgRect.Right - $radius * 2, $imgRect.Bottom - $radius * 2, $radius * 2, $radius * 2, 0, 90)
$path.AddArc($imgRect.X, $imgRect.Bottom - $radius * 2, $radius * 2, $radius * 2, 90, 90)
$path.CloseFigure()
$g.SetClip($path)
$g.DrawImage($cover, $imgRect)
$g.ResetClip()
$cover.Dispose()

$features = @("Cerita & tips mondok", "Artikel & galeri pondok", "Jadwal sholat & peta lokasi")
$y = 1020
foreach ($f in $features) {
  $g.FillEllipse((New-Object System.Drawing.SolidBrush $gold), 130, $y + 6, 12, 12)
  $g.DrawString($f, $fontFeat, (New-Object System.Drawing.SolidBrush $white), 160, $y)
  $y += 46
}

$g.DrawString("Scan QR untuk buka website", $fontQrHint, (New-Object System.Drawing.SolidBrush $mint),
  (New-Object System.Drawing.RectangleF 60, 1165, 960, 45), $sf)

$qrBytes = (New-Object System.Net.WebClient).DownloadData($qrUrl)
$ms = New-Object System.IO.MemoryStream(,$qrBytes)
$qr = [System.Drawing.Image]::FromStream($ms)
$qrSize = 300
$qrX = [int](($w - $qrSize) / 2)
$qrY = 1220
$qrPad = 16
$g.FillRectangle((New-Object System.Drawing.SolidBrush $white), ($qrX - $qrPad), ($qrY - $qrPad), ($qrSize + $qrPad * 2), ($qrSize + $qrPad * 2))
$g.DrawImage($qr, $qrX, $qrY, $qrSize, $qrSize)
$qr.Dispose()
$ms.Dispose()

$g.DrawString("corelgz.hwstudio.id/share", $fontUrl, (New-Object System.Drawing.SolidBrush $white),
  (New-Object System.Drawing.RectangleF 60, 1550, 960, 40), $sf)
$g.DrawString("(atau ketik link di atas)", $fontSmall, (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(200,255,255,255))),
  (New-Object System.Drawing.RectangleF 60, 1595, 960, 35), $sf)
$g.DrawString("Pondok Pesantren Sukahideng · Tasikmalaya", $fontSmall, (New-Object System.Drawing.SolidBrush $mint),
  (New-Object System.Drawing.RectangleF 60, 1680, 960, 35), $sf)
$g.DrawString("by Corel", $fontSmall, (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 255, 255, 255))),
  (New-Object System.Drawing.RectangleF 60, 1820, 960, 35), $sf)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$bmp.Dispose()

Write-Host "Saved: $out ($((Get-Item $out).Length) bytes)"
