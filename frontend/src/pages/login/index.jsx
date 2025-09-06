import React from 'react';
import { Helmet } from 'react-helmet-async';
import LoginForm from './components/LoginForm';
import BrandingSection from './components/BrandingSection';

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login - InfraSight AI Chennai | Municipal Infrastructure Monitoring</title>
        <meta name="description" content="Secure login to InfraSight AI Chennai municipal infrastructure monitoring system. Access real-time AI-powered infrastructure detection and management tools for Greater Chennai Corporation." />
        <meta name="keywords" content="Chennai municipal login, infrastructure monitoring, city management, AI detection, Greater Chennai Corporation portal" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen">
          {/* Branding Section - Left Side */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-2/5">
            <BrandingSection />
          </div>

          {/* Login Form Section - Right Side */}
          <div className="flex-1 lg:w-1/2 xl:w-3/5 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              {/* Mobile Branding Header */}
              <div className="lg:hidden mb-8 text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h1 className="text-xl font-semibold text-text-primary">InfraSight AI</h1>
                    <p className="text-sm text-text-secondary">Chennai Municipal Infrastructure</p>
                  </div>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-lg p-4">
                  <p className="text-sm text-text-secondary">
                    Greater Chennai Corporation Department of Public Works
                  </p>
                </div>
              </div>

              <LoginForm />

              {/* Mobile Trust Signals */}
              <div className="lg:hidden mt-8 text-center">
                <div className="flex items-center justify-center space-x-6 text-xs text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>
                    </svg>
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>WCAG Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </>
  );
};

export default Login;