import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const ReportPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    locality: '',
    issueCategory: '',
    description: '',
    files: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const chennaiLocalities = [
    'T. Nagar',
    'Adyar',
    'Mylapore',
    'Velachery',
    'Sholinganallur',
    'Anna Nagar',
    'Besant Nagar',
    'Guindy',
    'Chromepet',
    'Tambaram',
    'Porur',
    'Vadapalani',
    'Alwarpet',
    'Egmore',
    'Triplicane',
    'Royapettah',
    'Mandaveli',
    'Kotturpuram',
    'Nungambakkam',
    'Kodambakkam'
  ];

  const issueCategories = [
    'Waterlogging / Flooding',
    'Garbage Disposal / Waste Management',
    'Potholes / Bad Roads',
    'Poor Street Lighting',
    'Traffic Congestion',
    'Illegal Banners / Posters',
    'Open Drains / Sewage Issues',
    'Damaged Public Property',
    'Street Light Outage',
    'Water Supply Issues',
    'Road Safety Hazards',
    'Public Transport Issues'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('contactNumber', formData.contactNumber);
      submitData.append('locality', formData.locality);
      submitData.append('issueCategory', formData.issueCategory);
      submitData.append('description', formData.description);
      
      // Append files
      formData.files.forEach((file, index) => {
        submitData.append(`files`, file);
      });

      // TODO: Replace with actual API call
      // const response = await fetch('/api/reports', {
      //   method: 'POST',
      //   body: submitData
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Report Submitted Successfully!</h2>
            <p className="text-green-700 mb-4">
              Thank you for reporting this issue. Our team will review it and take appropriate action.
            </p>
            <p className="text-sm text-green-600">
              Redirecting to home page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Report an Issue - Chennai Civic Watch</title>
        <meta name="description" content="Report infrastructure issues in Chennai. Help improve your city by reporting problems to the Greater Chennai Corporation." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={20} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-text-primary">Chennai Civic Watch</span>
                  <span className="text-xs text-text-secondary">Chennai Municipal Infrastructure</span>
                </div>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link to="/public-data" className="text-text-secondary hover:text-primary transition-colors">
                  Public Data
                </Link>
                <Link to="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Official Login
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">Report an Issue</h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Help improve Chennai's infrastructure by reporting issues to the Greater Chennai Corporation
            </p>
          </div>

          {/* Report Form */}
          <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} className="text-red-500" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-text-primary mb-2">
                    Contact Number *
                  </label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    required
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="+91-98765-43210"
                  />
                </div>
              </div>

              {/* Location and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="locality" className="block text-sm font-medium text-text-primary mb-2">
                    Locality/Area *
                  </label>
                  <select
                    id="locality"
                    name="locality"
                    required
                    value={formData.locality}
                    onChange={(e) => handleInputChange('locality', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  >
                    <option value="">Select your locality</option>
                    {chennaiLocalities.map((locality) => (
                      <option key={locality} value={locality}>{locality}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="issueCategory" className="block text-sm font-medium text-text-primary mb-2">
                    Issue Category *
                  </label>
                  <select
                    id="issueCategory"
                    name="issueCategory"
                    required
                    value={formData.issueCategory}
                    onChange={(e) => handleInputChange('issueCategory', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  >
                    <option value="">Select issue category</option>
                    {issueCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Please provide a detailed description of the issue, including location details and any relevant information..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Upload Photos/Videos
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Icon name="Upload" size={48} className="text-text-secondary mx-auto mb-4" />
                    <p className="text-text-primary font-medium mb-2">
                      Click to upload photos or videos
                    </p>
                    <p className="text-text-secondary text-sm">
                      PNG, JPG, MP4 up to 10MB each
                    </p>
                  </label>
                </div>

                {/* File List */}
                {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-text-primary">Selected Files:</p>
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <Icon name="File" size={20} className="text-text-secondary" />
                          <span className="text-sm text-text-primary">{file.name}</span>
                          <span className="text-xs text-text-secondary">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Icon name="X" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6">
                <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
                  ← Back to Home
                </Link>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Icon name="Loader2" size={20} className="animate-spin" />
                      <span>Submitting Report...</span>
                    </div>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Information Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={24} className="text-blue-500 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">What happens after you submit?</h3>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Your report will be reviewed by our AI system for categorization</li>
                  <li>• It will be automatically routed to the appropriate GCC department</li>
                  <li>• You'll receive updates on the status of your report</li>
                  <li>• Our team will work to resolve the issue as quickly as possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportPage; 