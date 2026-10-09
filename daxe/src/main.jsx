import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';

const root = document.querySelector('#app');

if (!root) {
  throw new Error('No se encontró el contenedor principal #app.');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
