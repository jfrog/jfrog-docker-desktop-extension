@ECHO OFF

:: Runs JFrog CLI with the given arguments. The JFrog CLI's home directory is the extension's home directory.

set HOME_DIR=%USERPROFILE%\.jfrog-docker-desktop-extension
set LOGS_DIR=%HOME_DIR%\logs

set JFROG_CLI_HOME_DIR=%HOME_DIR%
set JFROG_CLI_USER_AGENT=jfrog-docker-extension
set JFROG_CLI_LOG_LEVEL=DEBUG
set CI=true

if not exist %LOGS_DIR% mkdir %LOGS_DIR%
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
set LOG_FILE_PATH=%LOGS_DIR%\jfrog-docker-desktop-extension.%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%.%datetime:~8,2%-%datetime:~10,2%.log

%~dp0jf %* 2>> %LOG_FILE_PATH%
