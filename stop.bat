@echo off
echo Stopping ChatBot Project D...

REM Stop the services
docker-compose down

echo Services stopped.
echo To start again, run: start.bat
pause 