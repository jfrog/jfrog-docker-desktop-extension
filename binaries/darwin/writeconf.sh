#!/bin/sh

HOME_DIR=~/.jfrog-docker-desktop-extension
CONF_FILE=$HOME_DIR/jfrog-docker-desktop-extension.conf

mkdir -p $HOME_DIR
printf $1 > $CONF_FILE
