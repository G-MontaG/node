FROM node:6

MAINTAINER Arthur Osipenko

# Provides cached layer for node_modules
ADD ./backend/package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /swagger && \
    mkdir -p /swagger/backend && \
    cp -a /tmp/node_modules /swagger/backend

# Define working directory
ADD . /swagger
WORKDIR /swagger

USER node

CMD ["node", "./backend/app.js"]
