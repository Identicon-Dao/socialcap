#!/usr/bin/env bash

# Push a Socialcap PROD
cp config-mainnet.ts ./src/lib/apis/config.ts

# first build it
npm run build

# run local build
#node build/index.js

# deploy to Socialcap server
rsync -vh -az ./build/ socialcap:~/ui/build
rsync -vh -az ./docker/ socialcap:~/ui/docker
scp ./package.json socialcap:~/ui/package.json

