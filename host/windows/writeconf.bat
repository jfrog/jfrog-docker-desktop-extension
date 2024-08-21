@ECHO OFF

:: Gets the extension configuration (in JSON format) as an argument and writes it to the configuration file.

set "HOME_DIR=%USERPROFILE%\.jfrog-docker-desktop-extension"
set "CONF_FILE=%HOME_DIR%\jfrog-docker-desktop-extension.conf"

if not exist "%HOME_DIR%" mkdir "%HOME_DIR%"
echo %* > %CONF_FILE%
