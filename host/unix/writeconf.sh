#!/bin/bash

# Gets the extension configuration (in JSON format) as an argument and writes it to the configuration file.

HOME_DIR=~/.jfrog-docker-desktop-extension
CONF_FILE=$HOME_DIR/jfrog-docker-desktop-extension.conf

mkdir -p $HOME_DIR
printf $1 > $CONF_FILE
