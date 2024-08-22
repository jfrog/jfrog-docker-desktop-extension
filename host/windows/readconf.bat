@ECHO OFF

:: Prints the extension configuration to stdout (in JSON format).

set "HOME_DIR=%USERPROFILE%\.jfrog-docker-desktop-extension"
set "CONF_FILE=%HOME_DIR%\jfrog-docker-desktop-extension.conf"

:: Debug: Echo the paths to ensure they are correct.
:: Use quotes around the CONF_FILE variable to handle paths with spaces.
type "%CONF_FILE%"