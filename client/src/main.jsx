import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

// Design System & Animations
import './styles/style.css';
import './styles/animations.css';

// Ensure standard cursor is restored
if (typeof document !== 'undefined') {
  document.body.style.cursor = 'auto';
  document.documentElement.style.cursor = 'auto';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
