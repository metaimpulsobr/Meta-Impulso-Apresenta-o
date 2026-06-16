import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkUrlForAuthToken } from './lib/googleAuth.ts';

// Handle OAuth redirection if we are inside a Google login popup
checkUrlForAuthToken();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

