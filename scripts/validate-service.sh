#!/bin/bash
sleep 10

echo "Checking container status..."
sudo docker ps | grep atphotobackend

echo "Checking container logs..."
sudo docker logs atphotobackend

echo "Checking port status..."
echo "Container port:"
netstat -tulpn | grep LISTEN | grep :3000
echo "Nginx port:"
netstat -tulpn | grep LISTEN | grep :80

# Update the curl check to use port 3000 for backend
if curl -f http://localhost:3000 > /dev/null 2>&1 && curl -f http://localhost > /dev/null 2>&1; then
    echo "Application is running on container port and accessible through nginx"
    exit 0
else
    echo "Application is not running"
    sudo docker ps -a
    exit 1
fi 
