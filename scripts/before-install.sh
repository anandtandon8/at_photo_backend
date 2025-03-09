#!/bin/bash
rm -rf /var/www/html/atphotobackend/*

aws s3 cp s3://privatebucketforatphoto/postgres_pass.txt /var/www/html/atphotobackend/postgres_pass.txt
aws s3 cp s3://privatebucketforatphoto/add_imgs_api_key.txt /var/www/html/atphotobackend/add_imgs_api_key.txt
aws s3 cp s3://privatebucketforatphoto/us-east-2-bundle.pem /var/www/html/atphotobackend/us-east-2-bundle.pem