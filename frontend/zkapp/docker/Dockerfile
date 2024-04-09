# For more information, please refer to https://aka.ms/vscode-docker-python
FROM ubuntu:22.04

RUN apt-get update
RUN apt -y upgrade 
RUN apt install -y curl

RUN curl -sL https://deb.nodesource.com/setup_20.x > install-node.sh
RUN sh install-node.sh
RUN apt install -y nodejs

# Install the App
WORKDIR /ui
COPY ./ /ui

RUN cd /ui
#RUN npm i # not necessary it seems ?

CMD node build/index.js

