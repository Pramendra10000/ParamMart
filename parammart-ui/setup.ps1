Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Welcome to ParamMart Setup" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Creating Test Folder..."

New-Item -ItemType Directory -Force -Path "src/test" | Out-Null

Write-Host ""
Write-Host "Setup Completed Successfully!" -ForegroundColor Green