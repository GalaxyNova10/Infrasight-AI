import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../context/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  // Mock credentials for different user types
  const mockCredentials = {
    admin: { email: 'admin@cityworks.gov', password: 'Admin123!', requiresMFA: true, role: 'admin' },
    manager: { email: 'manager@cityworks.gov', password: 'Manager123!', requiresMFA: true, role: 'manager' },
    worker: { email: 'worker@cityworks.gov', password: 'Worker123!', requiresMFA: false, role: 'worker' },
    citizen: { email: 'citizen@email.com', password: 'Citizen123!', requiresMFA: false, role: 'citizen' }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check credentials
    const validCredential = Object.values(mockCredentials).find(
      cred => cred.email === formData.email && cred.password === formData.password
    );
    
    if (!validCredential) {
      setErrors({ 
        general: 'Invalid email or password. Please try: admin@cityworks.gov / Admin123! or citizen@email.com / Citizen123!' 
      });
      setIsLoading(false);
      return;
    }
    
    // Check if MFA is required
    if (validCredential.requiresMFA && !showMFA) {
      setShowMFA(true);
      setIsLoading(false);
      return;
    }
    
    // Validate MFA if shown
    if (showMFA) {
      if (!mfaCode) {
        setErrors({ mfa: 'Please enter the verification code' });
        setIsLoading(false);
        return;
      }
      
      if (mfaCode !== '123456') {
        setErrors({ mfa: 'Invalid verification code. Use: 123456' });
        setIsLoading(false);
        return;
      }
    }
    
    // Successful login - redirect to dashboard
    login(validCredential);
    setIsLoading(false);
    navigate('/main-dashboard');
  };

  const handleMFASubmit = (e) => {
    e.preventDefault();
    handleLogin(e);
  };

  if (showMFA) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-lg shadow-elevation-2 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={24} color="white" />
            </div>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Two-Factor Authentication</h2>
            <p className="text-text-secondary">
              We've sent a verification code to your registered device. Please enter it below.
            </p>
          </div>

          <form onSubmit={handleMFASubmit} className="space-y-6">
            <Input
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit code"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              error={errors.mfa}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              className="mt-6"
            >
              Verify & Sign In
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowMFA(false)}
                className="text-sm text-primary hover:underline"
              >
                Back to login
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <Icon name="Info" size={16} className="inline mr-2" />
              Demo code: <strong>123456</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-lg shadow-elevation-2 p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={24} color="white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-semibold text-text-primary">InfraSight AI</h1>
              <p className="text-sm text-text-secondary">Municipal Infrastructure</p>
            </div>
          </div>
          <h2 className="text-xl font-medium text-text-primary mb-2">Welcome Back</h2>
          <p className="text-text-secondary">Sign in to access the infrastructure monitoring system</p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-smooth"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            
            <button
              type="button"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            className="mt-6"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-text-secondary text-sm mb-4">
            Don't have an account?
          </p>
          <Button
            variant="outline"
            size="default"
            fullWidth
            onClick={() => navigate('/citizen-registration')}
          >
            Register as Citizen
          </Button>
        </div>

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
    </div>
  );
};

export default LoginForm;