@ECHO OFF

:: Checks whether the user has permissions to run scans in Xray.
:: The return value (in stdout) is the HTTP code returned from Xray.

set "JFROG_CLI_HOME_DIR=%USERPROFILE%\.jfrog-docker-desk extension"

:: Debug: Echo the JFROG_CLI_HOME_DIR path
echo JFROG_CLI_HOME_DIR is set to: "%JFROG_CLI_HOME_DIR%"

:: Run the JFrog CLI with the specified command.
:: Handle paths with spaces by wrapping the command in quotes.
"%~dp0jf" xr curl --server-id validation -X POST -H "Content-Type:application/json" -d "{\"component_details\":[{\"component_id\":\"testComponent\"}]}" api/v1/summary/component -s --output nul -w %%{exitcode},%%{http_code}