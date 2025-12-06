#!/bin/bash

#===============================================================================
#
#       FILE: docker-manager.sh
# 
#       USAGE: ./docker-manager.sh <command> [--env-file <path>]
# 
#   DESCRIPTION: A professional Bash script for managing Docker projects.
#                Supports Docker login, build, pull, push, and Docker Compose
#                operations with an easy-to-use interface.
# 
#       OPTIONS: 
#                init       - Initialize Docker username and project name
#                login      - Log in to Docker registry
#                pull       - Pull Docker image
#                push       - Push Docker image
#                build      - Build Docker image
#                create     - Start containers (Docker Compose)
#                close      - Stop containers (Docker Compose)
#                recreate   - Restart containers (close + create)
#                start      - Start stopped containers
#                stop       - Stop running containers
#                help       - Display this help message
# 
#   REQUIREMENTS: bash, docker, docker-compose, jq
#       AUTHOR: Matéo Florian Callec
#       LICENSE: MIT
#       REPO: https://github.com/mateocallec/docker-manager.sh
#
#===============================================================================


# Set the project directory
PROJECT_DIR=$(pwd)
CONFIG_FILE="$PROJECT_DIR/docker-manager.json"

# Colors
BLUE='\033[44m'
WHITE='\033[97m'
NC='\033[0m'

# Default configuration
DEFAULT_CONFIG='{
  "username": "user",
  "name": "my-project",
  "registry-host": "registry-1.docker.io",
  "registry-port": 5000,
  "docker-compose": "docker-compose.yml",
  "dockerfile": "Dockerfile"
}'

# Function to display header
display_header() {
  clear
  echo -e "${BLUE}${WHITE} Docker Manager ${NC}"
  echo
}

# Function to load configuration
load_config() {
  if [ -f "$CONFIG_FILE" ]; then
    CONFIG=$(cat "$CONFIG_FILE")
  else
    echo "No configuration file found. Using default configuration."
    CONFIG="$DEFAULT_CONFIG"
    save_config
  fi
}

# Function to save configuration
save_config() {
  echo "$CONFIG" > "$CONFIG_FILE"
}

# Function to prompt for command
prompt_command() {
  read -p "Enter Docker Manager command: " COMMAND
  echo
}

# Function to display help
display_help() {
  echo "Usage: $0 <command> [--env-file <path>]"
  echo "Available commands: login, pull, push, build, create, close, recreate, start, stop, init, help"
  echo "Options:"
  echo "  --env-file <path>   Specify the environment file path (default: /dev/null)"
}

# Function to prompt for Docker username and project name
prompt_init() {
  read -p "Enter Docker username: " USERNAME
  read -p "Enter project name: " PROJECT_NAME

  CONFIG=$(jq --arg user "$USERNAME" --arg name "$PROJECT_NAME" \
    '.username = $user | .name = $name' <<< "$CONFIG")
  save_config
  echo "Configuration saved to $CONFIG_FILE"
}

# Function to handle Docker login
docker_login() {
  local USERNAME=$(jq -r '.username' <<< "$CONFIG")
  read -sp "Enter Docker password: " PASSWORD
  echo
  echo "$PASSWORD" | docker login --username "$USERNAME" --password-stdin
}

# Function to handle Docker pull
docker_pull() {
  local IMAGE_NAME=$(jq -r '.name' <<< "$CONFIG")
  docker pull "$IMAGE_NAME"
}

# Function to handle Docker push
docker_push() {
  local IMAGE_NAME=$(jq -r '.name' <<< "$CONFIG")
  docker push "$IMAGE_NAME"
}

# Function to handle Docker build
docker_build() {
  local DOCKERFILE=$(jq -r '.dockerfile' <<< "$CONFIG")
  local IMAGE_NAME=$(jq -r '.name' <<< "$CONFIG")
  docker build -t "$IMAGE_NAME" -f "$DOCKERFILE" .
}

# Function to handle Docker create
docker_create() {
  local COMPOSE_FILE=$(jq -r '.["docker-compose"]' <<< "$CONFIG")
  if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Error: $COMPOSE_FILE not found in $PROJECT_DIR"
    exit 1
  fi

  # Use the provided --env-file if specified, otherwise use /dev/null
  if [ -n "$ENV_FILE" ]; then
    docker-compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d
  else
    docker-compose --env-file /dev/null -f "$COMPOSE_FILE" up -d
  fi
}

# Function to handle Docker close
docker_close() {
  local COMPOSE_FILE=$(jq -r '.["docker-compose"]' <<< "$CONFIG")
  if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Error: $COMPOSE_FILE not found in $PROJECT_DIR"
    exit 1
  fi

  if [ -n "$ENV_FILE" ]; then
    docker-compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" down
  else
    docker-compose --env-file /dev/null -f "$COMPOSE_FILE" down
  fi
}

# Function to handle Docker recreate
docker_recreate() {
  docker_close
  docker_create
}

# Function to handle Docker start
docker_start() {
  local COMPOSE_FILE=$(jq -r '.["docker-compose"]' <<< "$CONFIG")
  if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Error: $COMPOSE_FILE not found in $PROJECT_DIR"
    exit 1
  fi

  if [ -n "$ENV_FILE" ]; then
    docker-compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" start
  else
    docker-compose --env-file /dev/null -f "$COMPOSE_FILE" start
  fi
}

# Function to handle Docker stop
docker_stop() {
  local COMPOSE_FILE=$(jq -r '.["docker-compose"]' <<< "$CONFIG")
  if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Error: $COMPOSE_FILE not found in $PROJECT_DIR"
    exit 1
  fi

  if [ -n "$ENV_FILE" ]; then
    docker-compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" stop
  else
    docker-compose --env-file /dev/null -f "$COMPOSE_FILE" stop
  fi
}

# Main script logic
display_header
load_config

# Parse command line arguments
ENV_FILE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file)
      ENV_FILE="$2"
      shift 2
      ;;
    help)
      COMMAND="help"
      shift
      ;;
    *)
      if [ -z "$COMMAND" ]; then
        COMMAND="$1"
        shift
      else
        echo "Unknown argument: $1"
        exit 1
      fi
      ;;
  esac
done

# If no command provided, prompt for it
if [ -z "$COMMAND" ]; then
  prompt_command
fi

# Execute the command
case "$COMMAND" in
  init)
    prompt_init
    ;;
  login)
    docker_login
    ;;
  pull)
    docker_pull
    ;;
  push)
    docker_push
    ;;
  build)
    docker_build
    ;;
  create)
    docker_create
    ;;
  close)
    docker_close
    ;;
  recreate)
    docker_recreate
    ;;
  start)
    docker_start
    ;;
  stop)
    docker_stop
    ;;
  help)
    display_help
    ;;
  *)
    echo "Unknown command: $COMMAND"
    display_help
    exit 1
    ;;
esac
