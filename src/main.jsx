import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/rethink-sans/latin-400.css';
import '@fontsource/rethink-sans/latin-700.css';
import '@fontsource/gochi-hand/latin-400.css';
import '@fontsource/bagel-fat-one/latin-400.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/scroll.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
