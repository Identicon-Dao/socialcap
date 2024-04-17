#!/usr/bin/env bash

# check we are on the dev branch
git checkout dev

# Push a Socialcap PROD
cp config-devnet.ts ./src/lib/apis/config.ts

# first build it
npm run build

# run local build
#node build/index.js

# deploy to Socialcap server
rsync -vh -az ./build/ socialcap-dev:~/ui/build
rsync -vh -az ./docker/ socialcap-dev:~/ui/docker
scp ./package.json socialcap-dev:~/ui/package.json
scp ./package-lock.json socialcap-dev:~/ui/package-lock.json

# Rebuild docker and restart Nginx 
ssh socialcap-dev 'cd /home/socialcap-dev/ui; sudo -S sh docker/run-docker.sh'
ssh socialcap-dev 'sudo -S /etc/init.d/nginx restart'
