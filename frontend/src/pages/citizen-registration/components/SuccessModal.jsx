import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuccessModal = ({ isOpen, onClose, userEmail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-elevation-3 max-w-md w-full p-6 animate-slide-in">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} color="white" />
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Registration Successful!
          </h2>
          <p className="text-text-secondary mb-6">
            Welcome to InfraSight AI! Your account has been created successfully.
          </p>

          {/* Email Verification Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Icon name="Mail" size={20} className="text-primary mt-0.5" />
              <div className="text-left">
                <h3 className="font-medium text-text-primary mb-1">Verify Your Email</h3>
                <p className="text-sm text-text-secondary">
                  We've sent a verification email to <strong>{userEmail}</strong>. 
                  Please check your inbox and click the verification link to activate your account.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-muted rounded-lg p-4 mb-6">
            <h3 className="font-medium text-text-primary mb-3">What's Next?</h3>
            <div className="space-y-2 text-sm text-text-secondary text-left">
              <div className="flex items-center space-x-2">
                <Icon name="Circle" size={4} className="text-primary" />
                <span>Check your email for verification link</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Circle" size={4} className="text-primary" />
                <span>Complete email verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Circle" size={4} className="text-primary" />
                <span>Start reporting infrastructure issues</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Circle" size={4} className="text-primary" />
                <span>Engage with your community</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to="/login" className="block">
              <Button fullWidth iconName="LogIn" iconPosition="left">
                Sign In to Your Account
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              fullWidth 
              onClick={onClose}
              iconName="Home"
              iconPosition="left"
            >
              Return to Homepage
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-text-secondary">
              Didn't receive the email? Check your spam folder or{' '}
              <button className="text-primary hover:underline">
                resend verification email
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;