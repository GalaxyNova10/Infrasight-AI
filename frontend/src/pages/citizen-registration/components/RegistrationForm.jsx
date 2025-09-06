import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notificationPreferences: {
      email: true,
      sms: false,
      push: false
    },
    issueCategories: [],
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeNewsletter: false
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const cityOptions = [
    { value: 't-nagar', label: 'T. Nagar' },
    { value: 'adyar', label: 'Adyar' },
    { value: 'mylapore', label: 'Mylapore' },
    { value: 'velachery', label: 'Velachery' },
    { value: 'sholinganallur', label: 'Sholinganallur' },
    { value: 'anna-nagar', label: 'Anna Nagar' },
    { value: 'besant-nagar', label: 'Besant Nagar' },
    { value: 'guindy', label: 'Guindy' },
    { value: 'chromepet', label: 'Chromepet' },
    { value: 'tambaram', label: 'Tambaram' },
    { value: 'porur', label: 'Porur' },
    { value: 'vadapalani', label: 'Vadapalani' }
  ];

  const issueCategoryOptions = [
    { value: 'waterlogging', label: 'Waterlogging / Flooding' },
    { value: 'garbage', label: 'Garbage Disposal / Waste Management' },
    { value: 'potholes', label: 'Potholes / Bad Roads' },
    { value: 'streetlights', label: 'Poor Street Lighting' },
    { value: 'traffic', label: 'Traffic Congestion' },
    { value: 'banners', label: 'Illegal Banners / Posters' },
    { value: 'drains', label: 'Open Drains / Sewage Issues' },
    { value: 'damaged-property', label: 'Damaged Public Property' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNotificationChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: checked
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City district is required';
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(formData.zipCode)) {
        newErrors.zipCode = 'Please enter a valid 6-digit pincode';
      }
    }

    if (step === 3) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms of service';
      if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
      if (!captchaVerified) newErrors.captcha = 'Please complete the captcha verification';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      onSubmit(formData);
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    handleInputChange('phone', formatted);
  };

  const handleCaptchaVerify = () => {
    // Mock captcha verification
    setCaptchaVerified(true);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Personal Information</h2>
        <p className="text-text-secondary">Please provide your basic information to create your account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          error={errors.firstName}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          error={errors.lastName}
          required
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        description="We'll use this to send you updates about your reports"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        description="Minimum 6 characters"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        error={errors.password}
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="(555) 123-4567"
        description="For urgent notifications about infrastructure issues"
        value={formData.phone}
        onChange={handlePhoneChange}
        error={errors.phone}
        required
      />

      <Input
        label="Street Address"
        type="text"
        placeholder="Enter your street address"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        error={errors.address}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="City Area"
          placeholder="Select your area"
          options={cityOptions}
          value={formData.city}
          onChange={(value) => handleInputChange('city', value)}
          error={errors.city}
          required
        />

        <Input
          label="Pincode"
          type="text"
          placeholder="600001"
          value={formData.zipCode}
          onChange={(e) => handleInputChange('zipCode', e.target.value)}
          error={errors.zipCode}
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Notification Preferences</h2>
        <p className="text-text-secondary">Choose how you'd like to receive updates about infrastructure issues</p>
      </div>

      <div className="bg-muted rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">How would you like to be notified?</h3>
        <div className="space-y-4">
          <Checkbox
            label="Email Notifications"
            description="Receive updates via email about issue status and community announcements"
            checked={formData.notificationPreferences.email}
            onChange={(e) => handleNotificationChange('email', e.target.checked)}
          />
          <Checkbox
            label="SMS Text Messages"
            description="Get urgent alerts and status updates via text message"
            checked={formData.notificationPreferences.sms}
            onChange={(e) => handleNotificationChange('sms', e.target.checked)}
          />
          <Checkbox
            label="Push Notifications"
            description="Receive real-time notifications through your browser or mobile app"
            checked={formData.notificationPreferences.push}
            onChange={(e) => handleNotificationChange('push', e.target.checked)}
          />
        </div>
      </div>

      <div className="bg-muted rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Issue Categories of Interest</h3>
        <p className="text-text-secondary mb-4">Select the types of infrastructure issues you'd like to stay informed about in your area</p>
        <Select
          placeholder="Select issue categories"
          options={issueCategoryOptions}
          value={formData.issueCategories}
          onChange={(value) => handleInputChange('issueCategories', value)}
          multiple
          searchable
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Terms & Verification</h2>
        <p className="text-text-secondary">Please review and accept our terms to complete your registration</p>
      </div>

      <div className="bg-muted rounded-lg p-6 space-y-4">
        <Checkbox
          label="I agree to the Terms of Service"
          description="By checking this box, you agree to our terms and conditions for using the InfraSight AI platform"
          checked={formData.agreeToTerms}
          onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
          error={errors.agreeToTerms}
          required
        />

        <Checkbox
          label="I agree to the Privacy Policy"
          description="You consent to our collection and use of your personal information as described in our privacy policy"
          checked={formData.agreeToPrivacy}
          onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
          error={errors.agreeToPrivacy}
          required
        />

        <Checkbox
          label="Subscribe to newsletter (optional)"
          description="Receive monthly updates about city infrastructure improvements and community initiatives"
          checked={formData.subscribeNewsletter}
          onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
        />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Security Verification</h3>
        {!captchaVerified ? (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-border rounded"></div>
              <span className="text-text-primary">I'm not a robot</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCaptchaVerify}
              iconName="Shield"
              iconPosition="left"
            >
              Verify
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <span className="text-success font-medium">Verification completed successfully</span>
          </div>
        )}
        {errors.captcha && (
          <p className="text-error text-sm mt-2">{errors.captcha}</p>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-text-secondary'
              }`}>
                {step < currentStep ? (
                  <Icon name="Check" size={16} />
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <span className="text-sm text-text-secondary">
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Personal Information' :
              currentStep === 2 ? 'Preferences' : 'Verification'
            }
          </span>
        </div>
      </div>

      {/* Form Steps */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-border">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>
        ) : (
          <div></div>
        )}

        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={handleNextStep}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Next Step
          </Button>
        ) : (
          <Button
            type="submit"
            loading={isLoading}
            iconName="UserPlus"
            iconPosition="left"
          >
            Create Account
          </Button>
        )}
      </div>
    </form>
  );
};

export default RegistrationForm;