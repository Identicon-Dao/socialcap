#!/bin/sh
sudo docker build -t socialcap/ui:run -f ./docker/Dockerfile .

# stop and remove previous container
sudo docker rm $(sudo docker stop sc-ui)

# will run the Socialcap UI in host port 3000
sudo docker -l debug run -d --restart=always --name sc-ui \
  --net=host \
  --user $(id -u www-data):$(id -g www-data) \
  --env USER=www-data \
  --env GROUP=www-data \
  --env UID=$(id -u www-data) \
  --env GID=$(id -g www-data) \
  -v /etc/localtime:/etc/localtime:ro \
  socialcap/ui:run

# Restart Nginx just in case
sudo /etc/init.d/nginx restart
