#!/bin/bash

export JFROG_CLI_HOME_DIR=~/.jfrog-docker-desktop-extension
export JFROG_CLI_USER_AGENT=jfrog-docker-extension

$(dirname "$0")/jf $@
