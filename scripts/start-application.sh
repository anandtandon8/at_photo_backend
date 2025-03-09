#!/bin/bash
sudo docker run -d \
    --name atphotobackend \
    -p 3000:3000 \
    --restart unless-stopped \
    atphotobackend:Latest 
    