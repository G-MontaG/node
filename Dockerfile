FROM node:6

MAINTAINER Arthur Osipenko

# Create app directory
RUN apt-get update && \
    apt-get -y install curl

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src
ADD . /src

CMD ["node", "app.js"]
