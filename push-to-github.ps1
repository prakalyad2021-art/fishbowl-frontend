# PowerShell script to push to GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing to GitHub Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    $gitVersion = git --version 2>&1
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Or use GitHub Desktop: https://desktop.github.com/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Initialize git if needed
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Add remote
Write-Host ""
Write-Host "Setting up remote repository..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/prakalyad2021-art/fishbowl-frontend.git

Write-Host ""
Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Ready for AWS deployment - all fixes applied"

Write-Host ""
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "(You may be prompted for GitHub credentials)" -ForegroundColor Gray
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Go to AWS Amplify Console and connect this repository" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR: Push failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. Authentication required - use Personal Access Token"
    Write-Host "2. Repository doesn't exist or you don't have access"
    Write-Host "3. Check your GitHub credentials"
}

Write-Host ""
Read-Host "Press Enter to exit"


