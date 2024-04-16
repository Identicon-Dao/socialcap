#!/usr/bin/env bash

# Push a Socialcap PROD
cp config-mainnet.ts ./src/lib/apis/config.ts

# first build it
npm run build

# run local build
#node build/index.js

# deploy to Socialcap server
rsync -vh -az ./build/ socialcap-main:~/ui/build
rsync -vh -az ./docker/ socialcap-main:~/ui/docker
scp ./package.json socialcap-main:~/ui/package.json
scp ./package-lock.json socialcap-main:~/ui/package-lock.json

