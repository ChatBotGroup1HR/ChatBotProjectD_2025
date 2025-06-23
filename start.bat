@echo off
echo Starting ChatBot Project D...
echo This will start both PocketBase and the React application.

REM Check if .env file exists
if not exist .env (
    echo ❌ Error: .env file not found!
    echo.
    echo 📝 Please set up your environment variables:
    echo 1. Copy the example file: copy env.example .env
    echo 2. Edit .env with your credentials
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Build and start the services
echo Building and starting services...
docker-compose up --build -d

echo.
echo Services are starting up...
echo PocketBase will be available at: http://localhost:8090
echo React App will be available at: http://localhost:3000
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
pause 