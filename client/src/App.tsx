import { CssBaseline, ThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AppContext } from './contexts';
import { AppClient } from './clients';
import { routes } from './config';
import { Route as AppRoute } from './types';
import { createTheme } from '@mui/material/styles';
import { DefaultTheme } from '@mui/system';
import deepmerge from 'deepmerge';

function App() {
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
    console.log(createTheme(deepmerge<DefaultTheme>(dockerTheme, appTheme)));

    return createTheme(deepmerge<DefaultTheme>(dockerTheme, appTheme));
  };

  return (
    <AppContext.Provider value={appClient}>
      <DockerMuiThemeProvider>
        <ThemeProvider theme={(dockerTheme) => mergeDockerTheme(dockerTheme)}>
          <CssBaseline />
          <BrowserRouter>
            <Switch>
              {routes.map((route: AppRoute) => (
                <Route key={route.key} path={route.path} component={route.component} exact />
              ))}
              <Redirect to="/login" />
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </DockerMuiThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
