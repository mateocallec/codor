#!/bin/bash

# Get current directory path
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_PATH="${SCRIPT_DIR}/.."

sudo rm -rf "${PROJECT_PATH}/container-data"
