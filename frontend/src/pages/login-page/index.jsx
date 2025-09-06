import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

// Import our custom hooks and services
import { useAuth } from '../../context/AuthContext';
import { login, loginWithGoogle } from '../../services/api';
import Icon from '../../components/AppIcon';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAction } = useAuth(); // Get the login action from our global context

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  // A centralized function to handle the post-login logic
  const handleLoginSuccess = (token) => {
    loginAction(token); // Update global state
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;
    console.log('Decoded Token:', decodedToken);
    console.log('User Role:', userRole);

    if (userRole === 'admin' || userRole.includes('official')) {
      navigate('/dashboard'); // Redirect officials to the dashboard
    } else {
      navigate('/'); // Redirect citizens to the home page
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log('Submitting login form with:', formData);

    try {
      const data = await login(formData.email, formData.password);
      console.log('Login successful, received data:', data);
      handleLoginSuccess(data.access_token);
    } catch (err) {
      console.error('Login error:', err);
      console.error('Request details:', err.request);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      // Send Google's token to our backend to get our app's token
      const data = await loginWithGoogle(credentialResponse.credential);
      handleLoginSuccess(data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Google login failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  return (
    <>
      <Helmet>
        <title>Login - InfraSight AI</title>
        <meta name="description" content="Login portal for InfraSight AI - Greater Chennai Corporation officials and citizens." />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={24} color="white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-semibold text-text-primary">InfraSight AI</h1>
                <p className="text-sm text-text-secondary">Official Portal</p>
              </div>
            </Link>
            
            <h2 className="text-3xl font-bold text-text-primary mb-2">Welcome Back</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
            Or {' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
              register for a citizen account
            </Link>
          </p>
            <p className="text-text-secondary">
              Sign in to access the InfraSight AI platform
            </p>
          </div>

          {/* Login Methods */}
          <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-8">
            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="filled_blue" width="300px" />
            </div>
            
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">Or sign in with email</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} className="text-red-500" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="Loader2" size={20} className="animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-text-primary mb-2">Demo Credentials:</h4>
              <div className="text-xs text-text-secondary space-y-1">
                <p><strong>Admin:</strong> admin@cityworks.gov / Admin123!</p>
                <p><strong>Manager:</strong> manager@cityworks.gov / Manager123!</p>
                <p><strong>Worker:</strong> worker@cityworks.gov / Worker123!</p>
                <p><strong>Citizen:</strong> citizen@email.com / Citizen123!</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-text-secondary">
              Need help? Contact{' '}
              <a href="mailto:support@infrasightai.gov.in" className="text-primary hover:text-primary/80 transition-colors">
                support@infrasightai.gov.in
              </a>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link to="/" className="text-primary hover:text-primary/80 transition-colors text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;