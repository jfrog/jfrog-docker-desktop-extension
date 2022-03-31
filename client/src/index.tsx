import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/open-sans';
import '@fontsource/roboto';

import App from './App';

import { APP_TITLE, APP_DESCRIPTION } from './utils/constants';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
