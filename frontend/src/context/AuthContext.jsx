import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create the context
export const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for an existing token when the app first loads
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if the token is still valid
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ email: decoded.sub, role: decoded.role });
        } else {
          // If token is expired, remove it
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error("Failed to decode token on initial load:", error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  // This is the function the login page will call
  const loginAction = (token) => {
    localStorage.setItem('authToken', token);
    const decoded = jwtDecode(token);
    const userData = { email: decoded.sub, role: decoded.role };
    setUser(userData);
    return userData; // Return the user data after login
  };

  const logoutAction = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // The value provided to all child components
  const value = { user, loginAction, logoutAction };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// This is a custom hook to easily access the context in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};