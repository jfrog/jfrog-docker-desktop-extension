#!/bin/zsh

export JFROG_CLI_HOME_DIR=~/.jfrog-docker-desktop-extension

$(dirname "$0")/jf $@
