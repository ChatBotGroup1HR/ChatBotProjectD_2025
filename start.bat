@echo off
echo Starting ChatBot Project D...
echo This will start both PocketBase and the React application.

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