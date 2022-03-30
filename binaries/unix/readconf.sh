#!/bin/bash

HOME_DIR=~/.jfrog-docker-desktop-extension
CONF_FILE=$HOME_DIR/jfrog-docker-desktop-extension.conf

if [ -e $CONF_FILE ]
then
  cat $CONF_FILE
else
  echo "file not found" >&2
  exit 1
fi
