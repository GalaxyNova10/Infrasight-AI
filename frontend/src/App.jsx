// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { AuthProvider } from './context/AuthContext';
import ProjectRoutes from './Routes';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <Helmet>
            <title>InfraSight AI</title>
            <meta name="description" content="A platform for monitoring and managing urban infrastructure in Chennai." />
          </Helmet>
          <ProjectRoutes />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;