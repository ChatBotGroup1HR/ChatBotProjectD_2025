REM Stop the container
docker-compose down

REM Backup the data directory (using 7-Zip, needs to be installed)
"C:\Program Files\7-Zip\7z.exe" a pb_backups\pb_backup.zip pb_data\

REM Restart the container
docker-compose up -d