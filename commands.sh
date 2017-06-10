#!/bin/bash

d-exec-bash() {
 command docker exec -it $1 bash
}

d-build-node-dev() {
  local tag=${1:-node-dev};
  local repo=${2:-node};

  command docker build -t ${tag} -f ./Dockerfile-dev .
  command docker tag ${tag} gmontag/${repo}:${tag}
  command docker push gmontag/${repo}:${tag}
}

d-build-node-prod() {
  local tag=${1:-node-prod};
  local repo=${2:-node};

  command docker build -t ${tag} -f ./Dockerfile-prod .
  command docker tag ${tag} gmontag/${repo}:${tag}
  command docker push gmontag/${repo}:${tag}
}

d-build-nginx-dev() {
  local tag=${1:-nginx-dev};
  local repo=${2:-nginx};

  command docker build -t ${tag} ./nginx-dev
  command docker tag ${tag} gmontag/${repo}:${tag}
  command docker push gmontag/${repo}:${tag}
}

d-build-nginx-prod() {
  local tag=${1:-nginx-prod};
  local repo=${2:-nginx};

  command docker build -t ${tag} ./nginx-prod
  command docker tag ${tag} gmontag/${repo}:${tag}
  command docker push gmontag/${repo}:${tag}
}

d-build-swagger() {
  local tag=${1:-swagger};
  local repo=${2:-swagger};

  command docker build -t ${tag} ./swagger
  command docker tag ${tag} gmontag/${repo}:${tag}
  command docker push gmontag/${repo}:${tag}
}

d-container-ls() {
  local format="table {{.ID}}\t{{.Names}}\t{{.Command}}\t{{.Ports}}\t{{.Status}}\t{{.Size}}\t{{.Image}}";

  if [[ $1 ]]; then
      command docker container ls --size --format "${format}" --filter $1
  else
      command docker container ls --size --format "${format}"
  fi
}

d-container-diff() {
  command docker container diff $1
}

d-container-inspect() {
  if [[ $2 ]]; then
      command docker container inspect --format $2 $1
  else
      command docker container inspect $1
  fi
}

d-container-logs() {
  if [[ $2 ]]; then
      command docker container logs --timestamps --follow $1
  else
      command docker container logs --timestamps $1
  fi
}

d-container-port() {
  command docker container port $1 $2
}

d-container-stat() {
  command docker container stats;
}

d-container-top() {
  command docker container top $1 $2;
}

d-stack-deploy-dev() {
  local stack=${1:-server-dev};

  command docker stack deploy -c docker-compose-dev.yml ${stack};
}

d-stack-deploy-prod() {
  local stack=${1:-server-prod};

  command docker stack deploy -c docker-compose-prod.yml ${stack};
}

d-stack-rm-dev() {
  local stack=${1:-server-dev};

  command docker stack rm ${stack};
}

d-stack-rm-prod() {
  local stack=${1:-server-prod};

  command docker stack rm ${stack};
}

d-service-logs() {
  command docker service logs -f $1;
}

d-inspect-ip() {
  command docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $1
}

d-inspect-mac() {
  command docker inspect --format='{{range .NetworkSettings.Networks}}{{.MacAddress}}{{end}}' $1
}

d-inspect-logs() {
  command docker inspect --format='{{.LogPath}}' $1
}

d-inspect-image() {
  command docker inspect --format='{{.Config.Image}}' $1
}

d-inspect-ports() {
  command docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}} {{$p}} -> {{(index $conf 0).HostPort}} {{end}}' $1
}

d-inspect-json() {
  command docker inspect --format='{{json .Config}}' $1
}

d-network-ls() {
  local format="table {{.ID}}\t{{.Name}}\t{{.Driver}}\t{{.Scope}}\t{{.IPv6}}\t{{.Internal}}";

  if [[ $1 ]]; then
      command sudo docker network ls --format "${format}" --filter $1
  else
      command sudo docker network ls --format "${format}"
  fi
}

d-network-inspect() {
  if [[ $2 ]]; then
      command docker network inspect --format $2 $1
  else
      command docker network inspect $1
  fi
}

d-node-ls() {
  if [[ $1 ]]; then
      command docker node ls --filter $1
  else
      command docker node ls
  fi
}

d-node-inspect() {
  if [[ $2 ]]; then
      command docker node inspect --pretty --format $2 $1
  else
      command docker node inspect --pretty $1
  fi
}

d-node-ps() {
  if [[ $1 ]]; then
      command docker node ps --filter $1
  else
      command docker node ps
  fi
}

d-port() {
  command docker port $1 $2
}

d-rm() {
  command docker rm $(docker ps -a -q)
}

d-rmi() {
  command docker rmi $(docker images -q)
}
