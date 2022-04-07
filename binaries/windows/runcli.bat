@ECHO OFF
set JFROG_CLI_HOME_DIR=%USERPROFILE%\.jfrog-docker-desktop-extension
set JFROG_CLI_USER_AGENT=jfrog-docker-extension

%~dp0jf %*
