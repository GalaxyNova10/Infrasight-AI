// frontend/src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; // 1. Import
import './styles/tailwind.css';

const GOOGLE_CLIENT_ID = "880346120887-vmh1l9ee2tsujq40vqou4kdd0lj50enm.apps.googleusercontent.com"; // 2. Paste your Client ID here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> {/* 3. Wrap the app */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
);