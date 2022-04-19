#!/bin/bash

# Checks whether the user has permissions to run scans in Xray. The return value (in stdout) is the HTTP code returned from Xray.

export JFROG_CLI_HOME_DIR=~/.jfrog-docker-desktop-extension

$(dirname "$0")/jf xr curl --server-id validation -X POST -H "Content-Type:application/json" -d "{\"component_details\":[{\"component_id\":\"testComponent\"}]}" api/v1/summary/component -s --output /dev/null -w "%{exitcode},%{http_code}"
