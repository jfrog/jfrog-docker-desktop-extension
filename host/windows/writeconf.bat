@ECHO OFF

:: Gets the extension configuration (in JSON format) as an argument and writes it to the configuration file.
set "HOME_DIR=%USERPROFILE%\.jfrog-docker-desktop-extension"
set "CONF_FILE=%HOME_DIR%\jfrog-docker-desktop-extension.conf"

:: Create the HOME_DIR if it doesn't exist, handling paths with spaces
if not exist "%HOME_DIR%" mkdir "%HOME_DIR%"

:: Write the provided configuration to the CONF_FILE, handling paths with spaces
echo %* > "%CONF_FILE%"