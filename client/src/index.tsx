import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/open-sans';
import '@fontsource/roboto';
import Footer from './assets/footer.png';
import App from './App';
import { ddClient } from './api/utils';
import { Link } from '@mui/material';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <img
      src={Footer}
      alt=""
      style={{ zIndex: '-1', bottom: '0', position: 'fixed', transform: 'translateX(-50%)', left: '50%' }}
    />
    <Link
      sx={{ display: 'flex', left: '10px', bottom: '5px', position: 'fixed', fontSize: '13px', alignItems: 'center' }}
      onClick={() => ddClient?.host?.openExternal('https://github.com/jfrog/jfrog-docker-desktop-extension/issues/new')}
    >
      Give Feedback <QuestionAnswerOutlinedIcon sx={{ height: '16px' }} />
    </Link>
  </React.StrictMode>,
  document.getElementById('root')
);
