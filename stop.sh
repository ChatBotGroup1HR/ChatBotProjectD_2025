#!/bin/bash

echo "Stopping ChatBot Project D..."

# Stop the services
docker-compose down

echo "Services stopped."
echo "To start again, run: ./start.sh" 