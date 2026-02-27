{/*import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@/store';
import '@/i18n';
import './index.css';
import App from './App.jsx';

// Apply saved theme before first render to avoid flash
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

// Register Service Worker (PWA)
if (
  'serviceWorker' in navigator &&
  import.meta.env.PROD
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.log('SW registered'))
      .catch(() => { });
  });
}*/}


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@/store';
import '@/i18n';
import './index.css';
import App from './App.jsx';

const savedTheme = localStorage.getItem('theme');

if (
  savedTheme === 'dark' ||
  (!savedTheme &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

// ✅ register only in production
if (
  'serviceWorker' in navigator &&
  import.meta.env.PROD
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}