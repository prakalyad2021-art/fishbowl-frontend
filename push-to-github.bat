@echo off
echo ========================================
echo Pushing to GitHub Repository
echo ========================================
echo.

REM Check if git is available
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed or not in PATH
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo Or use GitHub Desktop: https://desktop.github.com/
    echo.
    pause
    exit /b 1
)

echo Git found! Initializing repository...
echo.

REM Initialize git if needed
if not exist .git (
    git init
)

REM Add remote (remove if exists, then add)
git remote remove origin 2>nul
git remote add origin https://github.com/prakalyad2021-art/fishbowl-frontend.git

echo.
echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "Ready for AWS deployment - all fixes applied"

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
echo (You may be prompted for GitHub credentials)
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo.
    echo Next step: Go to AWS Amplify Console and connect this repository
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Push failed
    echo ========================================
    echo.
    echo Possible issues:
    echo 1. Authentication required - use Personal Access Token
    echo 2. Repository doesn't exist or you don't have access
    echo 3. Check your GitHub credentials
    echo.
)

pause


