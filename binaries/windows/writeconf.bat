@ECHO OFF
set HOME_DIR=%USERPROFILE%\.jfrog-docker-desktop-extension
set CONF_FILE=%HOME_DIR%\jfrog-docker-desktop-extension.conf

if not exist %HOME_DIR% mkdir %HOME_DIR%
echo %~1 > %CONF_FILE%
