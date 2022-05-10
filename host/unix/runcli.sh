#!/bin/bash

# Runs JFrog CLI with the given arguments. The JFrog CLI's home directory is the extension's home directory.

export JFROG_CLI_HOME_DIR=~/.jfrog-docker-desktop-extension
export JFROG_CLI_USER_AGENT=jfrog-docker-extension

$(dirname "$0")/jf $@
