import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './styles.css';

import App from './App';
import { useQueryClient } from '@tanstack/react-query';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
