#!/bin/bash
docker build -t myapp .
docker run -d -p 3000:3000 myapp
