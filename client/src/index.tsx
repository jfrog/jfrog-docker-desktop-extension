import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import '@fontsource/open-sans';
import '@fontsource/roboto';

import App from './App';

import { APP_TITLE, APP_DESCRIPTION } from './utils/constants';

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <title>{APP_TITLE}</title>
      <meta name="description" content={APP_DESCRIPTION} />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Helmet>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
