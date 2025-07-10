# PowerShell Icon Processing Script for React Native/Expo App
# This script helps you manually set up app icons

param(
    [Parameter(Mandatory=$true)]
    [string]$SourceImage
)

$AssetsDir = "assets"
$SourcePath = Join-Path $AssetsDir $SourceImage

Write-Host "🔍 Checking for source image..." -ForegroundColor Yellow

if (-not (Test-Path $SourcePath)) {
    Write-Host "❌ Source image not found: $SourcePath" -ForegroundColor Red
    Write-Host "📁 Available image files in $AssetsDir :" -ForegroundColor Cyan
    
    if (Test-Path $AssetsDir) {
        Get-ChildItem $AssetsDir -Filter "*.jpg" | ForEach-Object {
            Write-Host "   - $($_.Name)" -ForegroundColor Gray
        }
        Get-ChildItem $AssetsDir -Filter "*.jpeg" | ForEach-Object {
            Write-Host "   - $($_.Name)" -ForegroundColor Gray
        }
        Get-ChildItem $AssetsDir -Filter "*.png" | ForEach-Object {
            Write-Host "   - $($_.Name)" -ForegroundColor Gray
        }
    }
    exit 1
}

Write-Host "✅ Found source image: $SourceImage" -ForegroundColor Green

Write-Host "`n📋 Icon Requirements:" -ForegroundColor Cyan
Write-Host "   - Main icon: 1024x1024 pixels (PNG format)" -ForegroundColor Gray
Write-Host "   - Adaptive icon: 1024x1024 pixels (PNG format)" -ForegroundColor Gray
Write-Host "   - Should work on light and dark backgrounds" -ForegroundColor Gray

Write-Host "`n🔧 Manual Steps to Process Your Icon:" -ForegroundColor Yellow
Write-Host "1. Open your image in an image editor (GIMP, Photoshop, Paint.NET, etc.)" -ForegroundColor White
Write-Host "2. Resize to 1024x1024 pixels (square)" -ForegroundColor White
Write-Host "3. Save as PNG format with these names:" -ForegroundColor White
Write-Host "   - assets/icon.png (main app icon)" -ForegroundColor Gray
Write-Host "   - assets/adaptive-icon.png (Android adaptive icon)" -ForegroundColor Gray
Write-Host "   - assets/favicon.png (256x256 for web)" -ForegroundColor Gray
Write-Host "4. Replace the old .jpg files" -ForegroundColor White

Write-Host "`n🐍 Automatic Processing (if you have Python + Pillow):" -ForegroundColor Yellow
Write-Host "   python process_icon.py $SourceImage" -ForegroundColor Gray

Write-Host "`n🏗️ After updating icons:" -ForegroundColor Cyan
Write-Host "   npm run android" -ForegroundColor Gray

Write-Host "`n💡 Pro tip: Use a simple, recognizable design that works at small sizes!" -ForegroundColor Green
