Add-Type -AssemblyName System.Drawing

function Add-RoundedRectPath([System.Drawing.Drawing2D.GraphicsPath]$path, [System.Drawing.Rectangle]$rect, [int]$radius) {
  $d = $radius * 2
  $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
  $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
  $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
  $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
  $path.CloseFigure()
}

function Draw-RoundedRect($g, [System.Drawing.Rectangle]$rect, [int]$radius, $brush) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  Add-RoundedRectPath $path $rect $radius
  $g.FillPath($brush, $path)
  $path.Dispose()
}

function Draw-ScanCorners($g, [int]$x, [int]$y, [int]$size, $color, [int]$len = 36, [int]$thick = 5) {
  $pen = New-Object System.Drawing.Pen($color, $thick)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  # top-left
  $g.DrawLine($pen, $x, $y + $len, $x, $y)
  $g.DrawLine($pen, $x, $y, $x + $len, $y)
  # top-right
  $g.DrawLine($pen, $x + $size - $len, $y, $x + $size, $y)
  $g.DrawLine($pen, $x + $size, $y, $x + $size, $y + $len)
  # bottom-left
  $g.DrawLine($pen, $x, $y + $size - $len, $x, $y + $size)
  $g.DrawLine($pen, $x, $y + $size, $x + $len, $y + $size)
  # bottom-right
  $g.DrawLine($pen, $x + $size - $len, $y + $size, $x + $size, $y + $size)
  $g.DrawLine($pen, $x + $size, $y + $size - $len, $x + $size, $y + $size)
  $pen.Dispose()
}

$w = 1080
$h = 1920
$out = Join-Path $PSScriptRoot "..\public\images\wa-status-v3.jpg"
$coverPath = Join-Path $PSScriptRoot "..\public\images\cover-hidup-di-pesantren.png"
$shareUrl = "https://corelgz.hwstudio.id/share"
$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=12&ecc=M&color=1B4332&bgcolor=FFFFFF&format=png&data=$([uri]::EscapeDataString($shareUrl))"

$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

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
$fontUrl = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
$fontSmall = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Regular)
$fontQrHint = New-Object System.Drawing.Font("Segoe UI", 28, [System.Drawing.FontStyle]::Bold)
$fontScanBadge = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)

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
$imgRect = New-Object System.Drawing.Rectangle 90, 360, 900, 600
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
Add-RoundedRectPath $path $imgRect 28
$g.SetClip($path)
$g.DrawImage($cover, $imgRect)
$g.ResetClip()
$path.Dispose()
$cover.Dispose()

$features = @("Cerita & tips mondok", "Artikel & galeri pondok", "Jadwal sholat & peta lokasi")
$y = 990
foreach ($f in $features) {
  $g.FillEllipse((New-Object System.Drawing.SolidBrush $gold), 130, $y + 6, 12, 12)
  $g.DrawString($f, $fontFeat, (New-Object System.Drawing.SolidBrush $white), 160, $y)
  $y += 46
}

# Divider line
$linePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(80, 255, 255, 255)), 1
$g.DrawLine($linePen, 180, 1145, 900, 1145)
$linePen.Dispose()

$g.DrawString("Buka websitenya di sini", $fontQrHint, (New-Object System.Drawing.SolidBrush $mint),
  (New-Object System.Drawing.RectangleF 60, 1165, 960, 42), $sf)

# SCAN badge pill
$badgeW = 220
$badgeH = 44
$badgeX = [int](($w - $badgeW) / 2)
$badgeY = 1218
Draw-RoundedRect $g ([System.Drawing.Rectangle]::new($badgeX, $badgeY, $badgeW, $badgeH)) 22 (
  New-Object System.Drawing.SolidBrush $gold
)
$g.DrawString("SCAN QR CODE", $fontScanBadge, (New-Object System.Drawing.SolidBrush $white),
  (New-Object System.Drawing.RectangleF $badgeX, $badgeY, $badgeW, $badgeH), $sf)

# QR card with shadow
$cardSize = 400
$cardX = [int](($w - $cardSize) / 2)
$cardY = 1280
$shadowRect = New-Object System.Drawing.Rectangle ($cardX + 6), ($cardY + 8), $cardSize, $cardSize
Draw-RoundedRect $g $shadowRect 28 (
  New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(90, 0, 0, 0))
)
Draw-RoundedRect $g ([System.Drawing.Rectangle]::new($cardX, $cardY, $cardSize, $cardSize)) 28 (
  New-Object System.Drawing.SolidBrush $white
)

$borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(40, 27, 67, 50)), 2
$borderPath = New-Object System.Drawing.Drawing2D.GraphicsPath
Add-RoundedRectPath $borderPath ([System.Drawing.Rectangle]::new($cardX, $cardY, $cardSize, $cardSize)) 28
$g.DrawPath($borderPen, $borderPath)
$borderPen.Dispose()
$borderPath.Dispose()

$qrBytes = (New-Object System.Net.WebClient).DownloadData($qrUrl)
$ms = New-Object System.IO.MemoryStream(,$qrBytes)
$qr = [System.Drawing.Image]::FromStream($ms)
$qrSize = 320
$qrX = $cardX + [int](($cardSize - $qrSize) / 2)
$qrY = $cardY + [int](($cardSize - $qrSize) / 2)
$g.DrawImage($qr, $qrX, $qrY, $qrSize, $qrSize)
Draw-ScanCorners $g ($qrX - 8) ($qrY - 8) ($qrSize + 16) $gold 40 6
$qr.Dispose()
$ms.Dispose()

# URL pill
$urlPillW = 720
$urlPillH = 56
$urlPillX = [int](($w - $urlPillW) / 2)
$urlPillY = 1710
Draw-RoundedRect $g ([System.Drawing.Rectangle]::new($urlPillX, $urlPillY, $urlPillW, $urlPillH)) 14 (
  New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(35, 255, 255, 255))
)
$g.DrawString("corelgz.hwstudio.id/share", $fontUrl, (New-Object System.Drawing.SolidBrush $white),
  (New-Object System.Drawing.RectangleF $urlPillX, $urlPillY, $urlPillW, $urlPillH), $sf)

$g.DrawString("Pondok Pesantren Sukahideng - Tasikmalaya", $fontSmall, (New-Object System.Drawing.SolidBrush $mint),
  (New-Object System.Drawing.RectangleF 60, 1790, 960, 35), $sf)
$g.DrawString("by Corel", $fontSmall, (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 255, 255, 255))),
  (New-Object System.Drawing.RectangleF 60, 1845, 960, 35), $sf)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$bmp.Dispose()

Write-Host "Saved: $out ($((Get-Item $out).Length) bytes)"
