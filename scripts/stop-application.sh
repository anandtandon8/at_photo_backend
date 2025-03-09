#!/bin/bash
if [ "$(docker ps -q --filter "name=atphotobackend")" ]; then
    sudo docker stop atphotobackend
    sudo docker rm atphotobackend
fi 
