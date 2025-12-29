#!/bin/bash

echo "Starting eLaundry production environment..."
docker-compose up --build -d elaundry-web

echo "eLaundry is running at http://localhost:3000"
echo "To stop: docker-compose down"
