#!/bin/bash
if [ "$(docker ps -q -f name=^/atphotobackend$)" ]; then
    echo "Stopping atphotobackend container..."
    sudo docker stop atphotobackend
    sudo docker rm atphotobackend
elif [ "$(docker ps -aq -f status=exited -f name=^/atphotobackend$)" ]; then
    echo "Removing stopped atphotobackend container..."
    sudo docker rm atphotobackend
fi 
