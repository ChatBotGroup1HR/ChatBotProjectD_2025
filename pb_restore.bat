REM Extract the backup (using 7-Zip)
"C:\Program Files\7-Zip\7z.exe" x pb_backup.zip

REM Start PocketBase
docker-compose up -d