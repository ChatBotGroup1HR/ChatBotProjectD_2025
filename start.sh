#!/bin/bash

echo "Starting ChatBot Project D..."
echo "This will start both PocketBase and the React application."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start the services
echo "Building and starting services..."
docker-compose up --build -d

echo ""
echo "Services are starting up..."
echo "PocketBase will be available at: http://localhost:8090"
echo "React App will be available at: http://localhost:3000"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down" 