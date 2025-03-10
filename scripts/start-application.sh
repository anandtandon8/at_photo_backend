#!/bin/bash
echo "Starting atphotobackend container..."
sudo docker run -d \
    --user root \
    --name atphotobackend \
    -p 3000:3000 \
    --restart unless-stopped \
    -e NODE_ENV=production \
    -e PORT=3000 \
    -e DB_HOST=atphotodb.c30k8ei8mp5j.us-east-2.rds.amazonaws.com \
    -e DB_NAME=classifications \
    -e DB_USER=postgres \
    -e DB_PASSWORD=postgres \
    -e ADD_IMGS_API_KEY=1234567890 \
    atphotobackend:Latest 
    