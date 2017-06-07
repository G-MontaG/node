#!/bin/bash

d-build-node-dev () {
  local tag=${1:-node-dev};
  local repo=${2:-node};

  command docker build -t ${tag} -f ./Dockerfile-dev .
  command docker tag ${tag} gmontag/${repo}:${tag}
  command docker push gmontag/${repo}:${tag}
}

d-build-node-prod () {
  local tag=${1:-node-prod};
  local repo=${2:-node};

  command docker build -t ${tag} -f ./Dockerfile-prod .
  command docker tag ${tag} gmontag/${repo}:${tag}
  command docker push gmontag/${repo}:${tag}
}

d-build-nginx-dev () {
  local tag=${1:-nginx-dev};
  local repo=${2:-nginx};

  command docker build -t ${tag} ./nginx-dev
  command docker tag ${tag} gmontag/${repo}:${tag}
  command docker push gmontag/${repo}:${tag}
}

d-build-nginx-prod () {
  local tag=${1:-nginx-prod};
  local repo=${2:-nginx};

  command docker build -t ${tag} ./nginx-prod
  command docker tag ${tag} gmontag/${repo}:${tag}
  command docker push gmontag/${repo}:${tag}
}

d-build-swagger () {
  local tag=${1:-swagger};
  local repo=${2:-swagger};

  command docker build -t ${tag} ./swagger
  command docker tag ${tag} gmontag/${repo}:${tag}
  command docker push gmontag/${repo}:${tag}
}

d-stack-deploy-dev () {
  local stack=${1:-server-dev};

  command docker stack deploy -c docker-compose-dev.yml ${stack};
}

d-stack-deploy-prod () {
  local stack=${1:-server-prod};

  command docker stack deploy -c docker-compose-prod.yml ${stack};
}

d-stack-rm-dev () {
  local stack=${1:-server-dev};

  command docker stack rm ${stack};
}

d-stack-rm-prod () {
  local stack=${1:-server-prod};

  command docker stack rm ${stack};
}

d-service-logs () {
  command docker service logs -f $1;
}
