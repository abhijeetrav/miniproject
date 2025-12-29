#!/bin/bash

echo "Starting eLaundry development environment..."
docker-compose -f docker-compose.yml up --build elaundry-dev
