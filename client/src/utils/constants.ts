// APP TEXT
export const APP_TITLE = 'docker';
export const APP_DESCRIPTION = 'Jfrog docker desktop extension';
export const FOOTER_TEXT = `${new Date().getFullYear()} Jfrog Ecosystem`;
// PAGES TITLE
export const PAGE_TITLE_HOME = 'Home';
export const PAGE_TITLE_DASHBOARD = 'Dashboard';
export const PAGE_TITLE_GH_PRIVATE = 'GitHub Private';
export const PAGE_TITLE_GH_PUBLIC = 'GitHub Public';
export const PAGE_TITLE_CODE = 'Code Editor';
export const PAGE_TITLE_SETTINGS = 'Settings';
export const PAGE_TITLE_PREFERENCES = 'Preferences';
// UI CONSTANTS
export const FOOTER_HEIGHT = 30;
export const HEADER_HEIGHT = 60;
export const DRAWER_WIDTH = 250;
// APP THEME
export const DARK_MODE_THEME = 'dark';
export const LIGHT_MODE_THEME = 'light';
export const GRAY_COLOR = '#556274';

// LOGIN PAGE
export const BASIC_AUTH = 'basic';
export const ACCESS_TOKEN = 'accessToken';
export const WINDOWS_SETUP = `powershell "Start-Process -Wait -Verb RunAs powershell '-NoProfile iwr https://releases.jfrog.io/artifactory/jfrog-cli/v2-jf/[RELEASE]/jfrog-cli-windows-amd64/jf.exe -OutFile $env:SYSTEMROOT\\system32\\jf.exe'" ; jf setup`;
export const LINUX_SETUP = 'curl -fL https://getcli.jfrog.io?setup | sh';
