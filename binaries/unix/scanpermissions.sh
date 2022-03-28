#!/bin/bash

export JFROG_CLI_HOME_DIR=~/.jfrog-docker-desktop-extension

$(dirname "$0")/jf xr curl --server-id validation -X POST -H "Content-Type:application/json" -d "{\"component_details\":[{\"component_id\":\"testComponent\"}]}" api/v1/summary/component -s --output /dev/null -w %{http_code}
