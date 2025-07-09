# Clean script for React Native/Expo project
# Run this script when you encounter bundling or caching issues

Write-Host "🧹 Cleaning React Native/Expo project..." -ForegroundColor Yellow

# Kill any running Metro processes
Write-Host "Stopping Metro bundler processes..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Cyan
npm cache clean --force

# Remove node_modules and reinstall
Write-Host "Removing node_modules..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Remove lock files except package-lock.json (we use npm)
Write-Host "Removing conflicting lock files..." -ForegroundColor Cyan
Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue
Remove-Item -Force pnpm-lock.yaml -ErrorAction SilentlyContinue

# Clean Expo cache
Write-Host "Cleaning Expo cache..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue

# Clean Metro cache
Write-Host "Cleaning Metro cache..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .metro-cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force metro-cache -ErrorAction SilentlyContinue
Remove-Item -Force .metro-health-check* -ErrorAction SilentlyContinue

# Clean Android build artifacts
Write-Host "Cleaning Android build artifacts..." -ForegroundColor Cyan
Remove-Item -Recurse -Force android\.gradle -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android\app\build -ErrorAction SilentlyContinue

# Clean Android logs
Write-Host "Cleaning Android crash logs..." -ForegroundColor Cyan
Remove-Item -Force android\hs_err_pid*.log -ErrorAction SilentlyContinue
Remove-Item -Force android\replay_pid*.log -ErrorAction SilentlyContinue

# Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Cyan
npm install

# Prebuild (regenerate native code)
Write-Host "Running prebuild..." -ForegroundColor Cyan
npx expo prebuild --clean

Write-Host "✅ Cleanup complete! You can now run:" -ForegroundColor Green
Write-Host "  npx expo start --clear" -ForegroundColor White
Write-Host "  npx expo run:android" -ForegroundColor White
