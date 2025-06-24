# ProjectD_Team1_2025
This is the repository for Team 1's Project D.

# Software Requirements
 - docker desktop
 - docker compose
 - bun/npm

# Quick Start (Recommended)

To run the complete application (PocketBase + React App):

## Setup Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp env.example .env
   ```

2. **Edit the .env file** with your own credentials:
   ```bash
   # Edit .env file with your preferred text editor
   nano .env
   # or
   notepad .env
   ```

3. **Important:** Never commit the `.env` file to version control!

## Cross-Platform Scripts:

**Linux/macOS:**
```bash
# Start everything
./start.sh

# Stop everything
./stop.sh
```

**Windows:**
```cmd
# Start everything
start.bat

# Stop everything
stop.bat
```

## Manual Docker Compose
```bash
# Start all services
docker-compose up --build -d

# Stop all services
docker-compose down
```

The application will be available at:
- **React App**: http://localhost:3000
- **PocketBase Admin**: http://localhost:8090/_/

# Docker

## Full Application (PocketBase + React App)

This project includes Docker Compose configuration to run both the database and the React application:

- **PocketBase**: Database and API backend
- **React App**: Frontend application served by nginx

### Commands:
```bash
# Start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

## PocketBase Only

If you only want to run PocketBase (for development), this project includes 4 bat files to make handling the database easier:

> pb_backup
    - stops the database, backs it up and restarts it
> pb_restore
    - starts database from last backup (PERMANENT!)
> pb_start
    - starts database
> pb_stop
    - stops database
    
# Pocketbase

When creating tables, make sure Lookup Tables are present for linking tables.

[![](https://mermaid.ink/img/pako:eNqFkU1vwyAMhv9K5HNUhTTkg-t2nbTzlItV3BStQGRI91Hlv48m23LYpPpg8GPZr8FXOHhNoID40eDAaHuXJZsCcciua3CzENm4ITN6Q2TRnFe_wQvy4YScPWMIb57134xDSxs9mjNleMGIvMJ5PW783gBL7c3dE4nGUohox-zAhJH0f6lp1FtqmQJyGNhoUJEnysESp7emEJaxeognSiqg0lUjv_bQuznVjOhevLc_Zeyn4QTqiOeQolXl-69_KZPTxA9-chGULMTSBNQV3kGVZbuTdVkLIctOdqVscvhIWFS7qu26bi-krFsh93MOn4tusZNl0TRlK6pGFnUjqhxIm-j5aV32svP5C8_Blx0?type=png)](https://mermaid.live/edit#pako:eNqFkU1vwyAMhv9K5HNUhTTkg-t2nbTzlItV3BStQGRI91Hlv48m23LYpPpg8GPZr8FXOHhNoID40eDAaHuXJZsCcciua3CzENm4ITN6Q2TRnFe_wQvy4YScPWMIb57134xDSxs9mjNleMGIvMJ5PW783gBL7c3dE4nGUohox-zAhJH0f6lp1FtqmQJyGNhoUJEnysESp7emEJaxeognSiqg0lUjv_bQuznVjOhevLc_Zeyn4QTqiOeQolXl-69_KZPTxA9-chGULMTSBNQV3kGVZbuTdVkLIctOdqVscvhIWFS7qu26bi-krFsh93MOn4tusZNl0TRlK6pGFnUjqhxIm-j5aV32svP5C8_Blx0)