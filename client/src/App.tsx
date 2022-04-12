import { CssBaseline, ThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AppContext } from './contexts';
import { AppClient } from './clients';
import { routes } from './config';
import { Route as AppRoute } from './types';
import { createTheme, styled } from '@mui/material/styles';
import './main.css';
import { useMemo } from 'react';
import { amber, grey } from '@mui/material/colors';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#1D272D' : '#F4F4F6',
          },
          primary: {
            main: '#4172E8',
          },
          secondary: {
            main: '#00FF00',
          },
        },
        typography: {
          fontFamily: 'Open Sans',
          h6: {
            fontFamily: 'Roboto',
          },
          h5: {
            fontFamily: 'Roboto',
            color: prefersDarkMode ? '#fff' : '#17191E',
          },
          button: {
            color: prefersDarkMode ? '#fff' : '#17191E',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: '700',
            width: '120px',
            height: '40px',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                '&:hover': {
                  borderColor: '#0062cc',
                  boxShadow: 'none',
                },
                '&:active': {
                  boxShadow: 'none',
                  borderColor: '#005cbf',
                },
                '&:focus': {
                  boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
                },
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              sx: {
                background: prefersDarkMode ? '#1D272D' : '#FFFFFF',
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                fontFamily: 'Open Sans',
                height: '100vh',
                padding: '40px 40px',
              },
              '.MuiFormLabel-root > .MuiFormControl-root': {
                marginTop: '3px',
                background: '#fff',
              },
              '.MuiOutlinedInput-root': {
                borderRadius: '4px',
              },
              scrollbarColor: '#6b6b6b #2b2b2b',
            },
          },
        },
      }),
    [prefersDarkMode]
  );
  const appClient = new AppClient();

  return (
    <AppContext.Provider value={appClient}>
      <ThemeProvider theme={theme}>
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
    </AppContext.Provider>
  );
}

export default App;
