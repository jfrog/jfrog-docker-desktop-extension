#!/bin/bash

# Runs JFrog CLI with the given arguments. The JFrog CLI's home directory is the extension's home directory.

HOME_DIR=~/.jfrog-docker-desktop-extension
LOGS_DIR=$HOME_DIR/logs
LOG_FILE_PATH=$LOGS_DIR/jfrog-docker-desktop-extension.$(date -n +"%Y-%m-%d.%H-%M").log

export JFROG_CLI_HOME_DIR=$HOME_DIR
export JFROG_CLI_USER_AGENT=jfrog-docker-extension
export JFROG_CLI_LOG_LEVEL=DEBUG
export CI=true

if [ ! -d $LOGS_DIR ]
  then mkdir -p $LOGS_DIR
fi

"$(dirname "$0")"/jf "$@" 2>> "$LOG_FILE_PATH"
