#!/bin/bash

echo "Starting ChatBot Project D..."
echo "This will start both PocketBase and the React application."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo ""
    echo "📝 Please set up your environment variables:"
    echo "1. Copy the example file: cp env.example .env"
    echo "2. Edit .env with your credentials"
    echo "3. Run this script again"
    echo ""
    exit 1
fi

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