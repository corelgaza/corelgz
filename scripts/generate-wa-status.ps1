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

function Draw-RoundedImage($g, [string]$path, [System.Drawing.Rectangle]$rect, [int]$radius) {
  if (-not (Test-Path $path)) { return }
  $img = [System.Drawing.Image]::FromFile($path)
  if ($radius -le 0) {
    $g.DrawImage($img, $rect)
    $img.Dispose()
    return
  }
  $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
  Add-RoundedRectPath $clip $rect $radius
  $state = $g.Save()
  $g.SetClip($clip)
  $g.DrawImage($img, $rect)
  $g.Restore($state)
  $clip.Dispose()
  $img.Dispose()
}

function Draw-ScanCorners($g, [int]$x, [int]$y, [int]$size, $color, [int]$len = 36, [int]$thick = 5) {
  $pen = New-Object System.Drawing.Pen($color, $thick)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $g.DrawLine($pen, $x, $y + $len, $x, $y)
  $g.DrawLine($pen, $x, $y, $x + $len, $y)
  $g.DrawLine($pen, $x + $size - $len, $y, $x + $size, $y)
  $g.DrawLine($pen, $x + $size, $y, $x + $size, $y + $len)
  $g.DrawLine($pen, $x, $y + $size - $len, $x, $y + $size)
  $g.DrawLine($pen, $x, $y + $size, $x + $len, $y + $size)
  $g.DrawLine($pen, $x + $size - $len, $y + $size, $x + $size, $y + $size)
  $g.DrawLine($pen, $x + $size, $y + $size - $len, $x + $size, $y + $size)
  $pen.Dispose()
}

$root = Join-Path $PSScriptRoot "..\public\images"
$w = 1080
$h = 1920
$out = Join-Path $root "wa-status-v4.jpg"
$shareUrl = "https://corelgz.hwstudio.id/share"
$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=12&ecc=M&color=1B4332&bgcolor=FFFFFF&format=png&data=$([uri]::EscapeDataString($shareUrl))"

$heroCover = Join-Path $root "cover-komunikasi-ortu.png"
$articleCovers = @(
  (Join-Path $root "cover-hidup-di-pesantren.png"),
  (Join-Path $root "cover-tips-betah.png"),
  (Join-Path $root "cover-rutinitas-harian.png"),
  (Join-Path $root "cover-checklist-santri-baru.png"),
  (Join-Path $root "cover-kangen-rumah-santri-baru.png"),
  (Join-Path $root "cover-komunikasi-ortu.png")
)

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

$fontBadge = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$fontTitle = New-Object System.Drawing.Font("Segoe UI", 46, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Regular)
$fontStat = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)
$fontFeat = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Regular)
$fontUrl = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$fontSmall = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Regular)
$fontQrHint = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
$fontScanBadge = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)
$fontArtikelLabel = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

# Hero image full-width top
$heroRect = New-Object System.Drawing.Rectangle 0, 0, $w, 820
Draw-RoundedImage $g $heroCover $heroRect 0

# Dark gradient overlay on hero
$overlayRect = [System.Drawing.Rectangle]::new(0, 0, $w, 820)
$overlayBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $overlayRect, `
  ([System.Drawing.Color]::FromArgb(200, 15, 40, 30)), `
  ([System.Drawing.Color]::FromArgb(20, 15, 40, 30)), 90
$g.FillRectangle($overlayBrush, 0, 0, $w, 820)
$overlayBrush.Dispose()

# Header on hero
Draw-RoundedRect $g ([System.Drawing.Rectangle]::new(340, 70, 400, 44)) 22 (
  New-Object System.Drawing.SolidBrush $gold
)
$g.DrawString("6 ARTIKEL BARU", $fontBadge, (New-Object System.Drawing.SolidBrush $white),
  (New-Object System.Drawing.RectangleF 340, 70, 400, 44), $sf)

$g.DrawString("SANTRI JOURNEY", $fontBadge, (New-Object System.Drawing.SolidBrush $mint),
  (New-Object System.Drawing.RectangleF 80, 130, 920, 40), $sf)
$g.DrawString("Kehidupan Santri di", $fontSub, (New-Object System.Drawing.SolidBrush $white),
  (New-Object System.Drawing.RectangleF 60, 175, 960, 36), $sf)
$g.DrawString("Pesantren Sukahideng", $fontTitle, (New-Object System.Drawing.SolidBrush $white),
  (New-Object System.Drawing.RectangleF 40, 210, 1000, 120), $sf)

# Article cover grid (3 x 2)
$gridY = 860
$g.DrawString("6 Artikel · Tips Mondok · Cerita Santri", $fontArtikelLabel,
  (New-Object System.Drawing.SolidBrush $mint),
  (New-Object System.Drawing.RectangleF 60, $gridY, 960, 36), $sf)

$thumbW = 310
$thumbH = 195
$gapX = 20
$gapY = 16
$startX = [int](($w - (3 * $thumbW + 2 * $gapX)) / 2)
$startY = $gridY + 50

for ($i = 0; $i -lt $articleCovers.Count; $i++) {
  $col = $i % 3
  $row = [math]::Floor($i / 3)
  $x = $startX + $col * ($thumbW + $gapX)
  $y = $startY + $row * ($thumbH + $gapY)
  $rect = New-Object System.Drawing.Rectangle $x, $y, $thumbW, $thumbH

  $shadow = New-Object System.Drawing.Rectangle ($x + 4), ($y + 5), $thumbW, $thumbH
  Draw-RoundedRect $g $shadow 16 (
    New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(70, 0, 0, 0))
  )
  Draw-RoundedImage $g $articleCovers[$i] $rect 16

  $borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 255, 255, 255)), 2
  $borderPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  Add-RoundedRectPath $borderPath $rect 16
  $g.DrawPath($borderPen, $borderPath)
  $borderPen.Dispose()
  $borderPath.Dispose()
}

# Stats pills
$statsY = $startY + 2 * ($thumbH + $gapY) + 24
$pills = @("6 Artikel", "Galeri Foto", "Jadwal Sholat")
$pillW = 280
$pillH = 42
$pillGap = 16
$pillStartX = [int](($w - (3 * $pillW + 2 * $pillGap)) / 2)
for ($i = 0; $i -lt $pills.Count; $i++) {
  $px = $pillStartX + $i * ($pillW + $pillGap)
  Draw-RoundedRect $g ([System.Drawing.Rectangle]::new($px, $statsY, $pillW, $pillH)) 21 (
    New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(45, 255, 255, 255))
  )
  $g.DrawString($pills[$i], $fontStat, (New-Object System.Drawing.SolidBrush $white),
    (New-Object System.Drawing.RectangleF $px, $statsY, $pillW, $pillH), $sf)
}

# Divider
$divY = $statsY + 70
$linePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(80, 255, 255, 255)), 1
$g.DrawLine($linePen, 160, $divY, 920, $divY)
$linePen.Dispose()

$g.DrawString("Scan QR buat buka websitenya", $fontQrHint, (New-Object System.Drawing.SolidBrush $mint),
  (New-Object System.Drawing.RectangleF 60, ($divY + 12), 960, 40), $sf)

# SCAN badge
$badgeW = 260
$badgeH = 40
$badgeX = [int](($w - $badgeW) / 2)
$badgeY = $divY + 58
Draw-RoundedRect $g ([System.Drawing.Rectangle]::new($badgeX, $badgeY, $badgeW, $badgeH)) 20 (
  New-Object System.Drawing.SolidBrush $gold
)
$g.DrawString("SCAN QR CODE", $fontScanBadge, (New-Object System.Drawing.SolidBrush $white),
  (New-Object System.Drawing.RectangleF $badgeX, $badgeY, $badgeW, $badgeH), $sf)

# QR card
$cardSize = 360
$cardX = [int](($w - $cardSize) / 2)
$cardY = $badgeY + 56
$shadowRect = New-Object System.Drawing.Rectangle ($cardX + 5), ($cardY + 7), $cardSize, $cardSize
Draw-RoundedRect $g $shadowRect 24 (
  New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(90, 0, 0, 0))
)
Draw-RoundedRect $g ([System.Drawing.Rectangle]::new($cardX, $cardY, $cardSize, $cardSize)) 24 (
  New-Object System.Drawing.SolidBrush $white
)

$qrBytes = (New-Object System.Net.WebClient).DownloadData($qrUrl)
$ms = New-Object System.IO.MemoryStream(,$qrBytes)
$qr = [System.Drawing.Image]::FromStream($ms)
$qrSize = 290
$qrX = $cardX + [int](($cardSize - $qrSize) / 2)
$qrY = $cardY + [int](($cardSize - $qrSize) / 2)
$g.DrawImage($qr, $qrX, $qrY, $qrSize, $qrSize)
Draw-ScanCorners $g ($qrX - 6) ($qrY - 6) ($qrSize + 12) $gold 36 5
$qr.Dispose()
$ms.Dispose()

# URL pill
$urlPillW = 700
$urlPillH = 52
$urlPillX = [int](($w - $urlPillW) / 2)
$urlPillY = $cardY + $cardSize + 36
Draw-RoundedRect $g ([System.Drawing.Rectangle]::new($urlPillX, $urlPillY, $urlPillW, $urlPillH)) 14 (
  New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
)
$g.DrawString("corelgz.hwstudio.id/share", $fontUrl, (New-Object System.Drawing.SolidBrush $white),
  (New-Object System.Drawing.RectangleF $urlPillX, $urlPillY, $urlPillW, $urlPillH), $sf)

$g.DrawString("Pondok Pesantren Sukahideng · Tasikmalaya", $fontSmall, (New-Object System.Drawing.SolidBrush $mint),
  (New-Object System.Drawing.RectangleF 60, ($urlPillY + 62), 960, 32), $sf)
$g.DrawString("by Corel · Santri Journey", $fontSmall,
  (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 255, 255, 255))),
  (New-Object System.Drawing.RectangleF 60, ($urlPillY + 98), 960, 32), $sf)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$bmp.Dispose()

Write-Host "Saved: $out ($((Get-Item $out).Length) bytes)"
