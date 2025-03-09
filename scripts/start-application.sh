#!/bin/bash
echo "Starting atphotobackend container..."
sudo docker run -d \
    --name atphotobackend \
    -p 3000:3000 \
    --restart unless-stopped \
    -e NODE_ENV=production \
    -e PORT=3000 \
    atphotobackend:Latest 
    