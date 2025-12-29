#!/bin/bash

echo "Building eLaundry Docker image..."
docker build -t elaundry-web:latest .

echo "Build completed successfully!"
echo "To run the container, use: docker run -p 3000:3000 elaundry-web:latest"
