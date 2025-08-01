import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PublicHeader from './components/PublicHeader';
import RegistrationForm from './components/RegistrationForm';
import RegistrationBenefits from './components/RegistrationBenefits';
import SuccessModal from './components/SuccessModal';
import Icon from '../../components/AppIcon';

const CitizenRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegistrationSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Mock API call - simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration data:', formData);
      
      // Store registered email for success modal
      setRegisteredEmail(formData.email);
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error - in real app, show error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // In real app, might redirect to login or home page
  };

  return (
    <>
      <Helmet>
        <title>Citizen Registration - InfraSight AI Chennai</title>
        <meta name="description" content="Join InfraSight AI to report infrastructure issues, track community improvements, and engage with the Greater Chennai Corporation for better city services." />
        <meta name="keywords" content="citizen registration, infrastructure reporting, community engagement, Chennai city services, Greater Chennai Corporation, municipal portal" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Public Header */}
        <PublicHeader />

        {/* Main Content */}
        <main className="pt-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Join Chennai's Community
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  Create your account to report infrastructure issues, track improvements, and help build a smarter, more responsive Chennai
                </p>
                <div className="flex items-center justify-center space-x-6 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={20} />
                    <span>15,623+ Citizens</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={20} />
                    <span>2,847 Issues Resolved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={20} />
                    <span>24/7 Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Registration Content */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Registration Form */}
                <div className="order-2 lg:order-1">
                  <div className="bg-surface rounded-lg shadow-elevation-2 p-6 lg:p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-text-primary mb-2">
                        Create Your Account
                      </h2>
                      <p className="text-text-secondary">
                        Join thousands of Chennai citizens making their community better
                      </p>
                    </div>

                    <RegistrationForm 
                      onSubmit={handleRegistrationSubmit}
                      isLoading={isLoading}
                    />

                    {/* Sign In Link */}
                    <div className="mt-8 pt-6 border-t border-border text-center">
                      <p className="text-text-secondary">
                        Already have an account?{' '}
                        <Link 
                          to="/login" 
                          className="text-primary hover:underline font-medium"
                        >
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="order-1 lg:order-2">
                  <RegistrationBenefits />
                </div>
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <section className="bg-muted py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-text-primary mb-4">
                  How It Works
                </h2>
                <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                  Our AI-powered platform makes it easy to report issues and track improvements in your Chennai neighborhood
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Camera" size={24} color="white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">1. Report Issues</h3>
                  <p className="text-text-secondary">
                    Take a photo and describe infrastructure problems you encounter. Our AI helps categorize and prioritize your report for the Greater Chennai Corporation.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Zap" size={24} color="white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">2. AI Processing</h3>
                  <p className="text-text-secondary">
                    Advanced computer vision analyzes your report, verifies the issue, and automatically routes it to the right GCC department.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="CheckCircle" size={24} color="white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">3. Track Progress</h3>
                  <p className="text-text-secondary">
                    Receive real-time updates as Greater Chennai Corporation teams acknowledge, investigate, and resolve your reported issues.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={20} color="white" />
                  </div>
                  <span className="text-lg font-semibold text-text-primary">InfraSight AI</span>
                </div>
                <p className="text-text-secondary mb-4 max-w-md">
                  Empowering Chennai citizens and city officials with AI-driven infrastructure monitoring and community engagement tools for smarter urban management in collaboration with the Greater Chennai Corporation.
                </p>
                <div className="flex space-x-4">
                  <Icon name="Facebook" size={20} className="text-text-secondary hover:text-primary cursor-pointer" />
                  <Icon name="Twitter" size={20} className="text-text-secondary hover:text-primary cursor-pointer" />
                  <Icon name="Linkedin" size={20} className="text-text-secondary hover:text-primary cursor-pointer" />
                  <Icon name="Instagram" size={20} className="text-text-secondary hover:text-primary cursor-pointer" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-4">Quick Links</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                  <li><Link to="/how-it-works" className="hover:text-primary">How It Works</Link></li>
                  <li><Link to="/community" className="hover:text-primary">Community</Link></li>
                  <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-4">Legal</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
                  <li><Link to="/accessibility" className="hover:text-primary">Accessibility</Link></li>
                  <li><Link to="/security" className="hover:text-primary">Security</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8 text-center text-text-secondary">
              <p>&copy; {new Date().getFullYear()} InfraSight AI. All rights reserved. | Chennai Municipal Infrastructure Monitoring Platform</p>
            </div>
          </div>
        </footer>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          userEmail={registeredEmail}
        />
      </div>
    </>
  );
};

export default CitizenRegistration;