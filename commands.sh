#!/bin/bash

d-build() {
  local file=${3:-./Dockerfile};
  local path=${4:-.};
  command docker build -t $2 -f ${file} ${path}
  command docker tag $2 gmontag/$1:$2
  command docker push gmontag/$1:$2
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
  if [[ $1 ]]; then
      command docker container ls --size --filter $1
  else
      command docker container ls --size
  fi
}

d-container-ls-all() {
  if [[ $1 ]]; then
      command docker container ls --size --all --filter $1
  else
      command docker container ls --size --all
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

d-container-exec-bash() {
 command docker exec --interactive --tty $1 bash
}

d-image-history() {
 command docker image history --human $1
}

d-image-inspect() {
  if [[ $2 ]]; then
      command docker container inspect --format $2 $1
  else
      command docker container inspect $1
  fi
}

d-images() {
  if [[ $1 ]]; then
      command docker images --filter $1
  else
      command docker images
  fi
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

d-ps() {
  if [[ $1 ]]; then
      command docker ps --size --filter $1
  else
      command docker ps --size
  fi
}

d-ps-all() {
  if [[ $1 ]]; then
      command docker ps --all --size --filter $1
  else
      command docker ps --all --size
  fi
}

d-search() {
 command docker search $1
}

d-secret-create() {
  command echo $2 | docker secret create $1 -
}

d-secret-create-by-file() {
  command docker secret create $1 $2
}

d-secret-ls() {
  if [[ $1 ]]; then
      command docker secret ls --filter $1
  else
      command docker secret ls
  fi
}

d-secret-inspect() {
  if [[ $2 ]]; then
      command docker secret inspect --format $2 $1
  else
      command docker secret inspect $1
  fi
}

d-secret-rm() {
  command docker secret rm $1
}

d-service-logs() {
  command docker service logs --follow --timestamps $1;
}

d-service-inspect() {
  if [[ $2 ]]; then
      command docker service inspect --pretty --format $2 $1
  else
      command docker service inspect --pretty $1
  fi
}

d-service-ls() {
  if [[ $1 ]]; then
      command docker service ls --filter $1
  else
      command docker service ls
  fi
}

d-service-ps() {
  if [[ $1 ]]; then
      command docker service ps --filter $1
  else
      command docker service ps
  fi
}

d-service-rm() {
  command docker service rm $1
}

d-service-scale() {
  command docker service scale $1
}

d-stack-deploy-dev() {
  local stack=${1:-server-dev};

  command docker stack deploy --compose-file docker-compose-dev.yml ${stack};
}

d-stack-deploy-prod() {
  local stack=${1:-server-prod};

  command docker stack deploy --compose-file docker-compose-prod.yml ${stack};
}

d-stack-rm() {
  command docker stack rm $1;
}

d-stack-rm-dev() {
  local stack=${1:-server-dev};

  command docker stack rm ${stack};
}

d-stack-rm-prod() {
  local stack=${1:-server-prod};

  command docker stack rm ${stack};
}

d-stack-ps() {
  if [[ $1 ]]; then
      command docker stack ps --filter $1
  else
      command docker stack ps
  fi
}

d-stack-service() {
  if [[ $2 ]]; then
      command docker stack services --filter $2 $1
  else
      command docker stack services $1
  fi
}

d-stats() {
  if [[ $2 ]]; then
      command docker stats --format $2 $1
  else
      command docker stats $1
  fi
}

d-stats-all() {
  if [[ $2 ]]; then
      command docker stats --all --format $2 $1
  else
      command docker stats --all $1
  fi
}

d-swarm-init() {
  command docker swarm init --advertise-addr $1
}

d-swarm-join-token() {
  command docker swarm join-token $1
}

d-swarm-join() {
  command docker swarm join --token $1 $2
}

d-swarm-leave() {
  command docker swarm leave
}

d-swarm-unlock-key() {
 command docker swarm unlock-key
}

d-swarm-update() {
 command docker swarm update
}

d-system-df() {
  command docker system df --verbose
}

d-system-events() {
  if [[ $1 ]]; then
      command docker system events --filter $1
  else
      command docker system events
  fi
}

d-system-info() {
 command docker system info
}

d-top() {
  if [[ $2 ]]; then
      command docker top $1 --size --filter $2
  else
      command docker top $1 --size
  fi
}

d-version() {
  command docker version
}

d-volume-inspect() {
  if [[ $2 ]]; then
      command docker volume inspect --format $2 $1
  else
      command docker volume inspect $1
  fi
}

d-volume-ls() {
  if [[ $1 ]]; then
      command docker volume ls --filter $1
  else
      command docker volume ls
  fi
}

d-volume-rm() {
  command docker volume rm $1;
}

