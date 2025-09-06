import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { register } from '../../services/api';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const userData = { ...formData, role: 'citizen' };
      await register(userData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/auth/google`, { token: credentialResponse.credential });
      const { access_token } = response.data;
      login(access_token);
      const decodedToken = jwtDecode(access_token);
      const userRole = decodedToken.role;

      if (userRole.includes('official')) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Google registration failed. Please try again.');
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
        <title>Register - InfraSight AI</title>
        <meta name="description" content="Register for an InfraSight AI account to report issues and track your contributions." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Sign in
              </Link>
            </p>
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="filled_blue" />
          </div>
          
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">Or register with email</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            {error && <div className="p-3 text-center text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}
            {success && <div className="p-3 text-center text-sm text-green-700 bg-green-100 rounded-md">{success}</div>}

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="full_name" name="full_name" type="text" required value={formData.full_name} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="John Doe"/>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="you@example.com"/>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="••••••••"/>
            </div>

            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 font-semibold">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;