import { CssBaseline, ThemeProvider } from '@mui/material';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AppContext } from './contexts';
import { AppClient } from './clients';
import { routes } from './config';
import { Route as AppRoute } from './types';
import { createTheme } from '@mui/material/styles';
import './main.css';

const theme = createTheme({
  typography: {
    fontFamily: 'Open Sans',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F4F4F6',
          fontFamily: 'Open Sans',
          height: '100vh',
          padding: '40px 30px',
        },
        '.MuiFormLabel-root > .MuiFormControl-root': {
          marginTop: '3px',
        },
        '.MuiOutlinedInput-root': {
          background: '#fff',
        },
      },
    },
  },
});
function App() {
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
