import { CssBaseline, ThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppContext } from './contexts';
import { AppClient } from './clients';
import { createTheme } from '@mui/material/styles';
import { DefaultTheme } from '@mui/system';
import deepmerge from 'deepmerge';
import { LoginPage } from './pages/Login';
import { ScanPage } from './pages/Scan';
import { SetupEnvPage } from './pages/SetupEnv';
import { SettingsPage } from './pages/Setting';

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const appClient = new AppClient();

  const mergeDockerTheme = (dockerTheme: DefaultTheme) => {
    const appTheme: DefaultTheme = {
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
      },
      components: {
        MuiTypography: {
          styleOverrides: {
            root: {
              fontFamily: 'Open Sans',
              lineHeight: 'unset',
              letterSpacing: '0',
            },
            h1: {
              fontFamily: 'Roboto',
            },
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              cursor: 'pointer',
              width: 'fit-content',
            },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              textTransform: 'none',
              letterSpacing: 'inherit',
              fontSize: '13px',
              lineHeight: 'inherit',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              fontFamily: 'Open Sans',
              width: '120px',
              height: '40px',
              fontSize: '14px',
            },
            outlined: {
              color: '#007BFF',
            },
          },
        },

        MuiCssBaseline: {
          styleOverrides: {
            '#root': {
              position: 'relative',
              height: '100vh',
              padding: '40px 40px',
            },
            '.MuiFormLabel-root > .MuiFormControl-root': {
              marginTop: '3px',
              background: '#fff',
            },
            '&::-webkit-scrollbar': {
              width: 7,
            },
            '&::-webkit-scrollbar-track': {
              background: prefersDarkMode ? '#222e33' : '#e6e6ed',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: prefersDarkMode ? '#515557' : '#D8D8DF',
            },
          },
        },
      },
    };
    return createTheme(deepmerge<DefaultTheme>(dockerTheme, appTheme));
  };

  return (
    <AppContext.Provider value={appClient}>
      <DockerMuiThemeProvider>
        <ThemeProvider theme={(dockerTheme) => mergeDockerTheme(dockerTheme)}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route key={'scan'} path={'/scan'} element={<ScanPage />} />
              <Route key={'login'} path={'/login'} element={<LoginPage />} />
              <Route key={'setupenv'} path={'/setupenv'} element={<SetupEnvPage />} />
              <Route key={'settings'} path={'/settings'} element={<SettingsPage />} />
              <Route path="*" element={<LoginPage />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </DockerMuiThemeProvider>
    </AppContext.Provider>
  );
}
