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
import Cursor from './assets/cursor.png';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const appClient = new AppClient();

  const mergeDockerTheme = (dockerTheme: DefaultTheme) => {
    const appTheme = createTheme({
      ...dockerTheme,
      typography: {
        fontFamily: 'Open Sans',
        h1: {
          fontFamily: 'Roboto',
          lineHeight: 'unset',
          letterSpacing: '0',
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              width: '120px',
              height: '40px',
              fontWeight: '700',
            },
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            '#root': { position: 'relative', height: '100vh', padding: '40px 40px', cursor: `url(${Cursor}),auto}` },
            '.MuiFormLabel-root > .MuiFormControl-root': {
              marginTop: '3px',
              background: '#fff',
            },
            '.MuiOutlinedInput-root': {
              borderRadius: '4px',
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
    });
    return appTheme;
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
