@ECHO OFF

:: Runs JFrog CLI with the given arguments. The JFrog CLI's home directory is the extension's home directory.

set JFROG_CLI_HOME_DIR=%USERPROFILE%\.jfrog-docker-desktop-extension
set JFROG_CLI_USER_AGENT=jfrog-docker-extension

%~dp0jf %*
