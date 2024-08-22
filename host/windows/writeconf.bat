@ECHO OFF

:: Gets the extension configuration (in JSON format) as an argument and writes it to the configuration file.

set "HOME_DIR=%USERPROFILE%\.jfrog-docker-desktop-extension"
set "CONF_FILE=%HOME_DIR%\jfrog-docker-desktop-extension.conf"

:: Debug: Echo the HOME_DIR and CONF_FILE paths
echo HOME_DIR is set to: "%HOME_DIR%"
echo CONF_FILE is set to: "%CONF_FILE%"

:: Create the HOME_DIR if it doesn't exist, handling paths with spaces
if not exist "%HOME_DIR%" mkdir "%HOME_DIR%"

:: Write the provided configuration to the CONF_FILE, handling paths with spaces
echo %* > "%CONF_FILE%"

:: Debug: Echo the content written to the configuration file
echo Configuration written to %CONF_FILE%:
type "%CONF_FILE%"