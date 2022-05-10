import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/open-sans';
import '@fontsource/roboto';
import Footer from './assets/footer.png';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <img
      src={Footer}
      onClick={window.ddClient.host.openExternal('https://jfrog.com')}
      alt=""
      style={{ zIndex: '-1', bottom: '0', position: 'fixed', transform: 'translateX(-50%)', left: '50%' }}
    />
  </React.StrictMode>,
  document.getElementById('root')
);
