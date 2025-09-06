import React from 'react';
import Icon from '../../../components/AppIcon';


const BrandingSection = () => {
  const features = [
    {
      icon: 'Video',
      title: 'Real-time Monitoring',
      description: 'AI-powered video analysis detects infrastructure issues instantly'
    },
    {
      icon: 'MapPin',
      title: 'Geospatial Tracking',
      description: 'Precise location mapping for efficient resource deployment'
    },
    {
      icon: 'Users',
      title: 'Citizen Engagement',
      description: 'Direct reporting channel for community infrastructure concerns'
    },
    {
      icon: 'BarChart3',
      title: 'Data Analytics',
      description: 'Comprehensive insights for informed municipal decision-making'
    }
  ];

  const trustSignals = [
    {
      icon: 'Shield',
      text: 'Government Grade Security'
    },
    {
      icon: 'Lock',
      text: 'SSL Encrypted Connection'
    },
    {
      icon: 'CheckCircle',
      text: 'WCAG Accessibility Compliant'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary to-blue-900 text-white p-8 lg:p-12 flex flex-col justify-between min-h-full">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={32} color="white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">InfraSight AI</h1>
            <p className="text-blue-100 text-lg">Municipal Infrastructure Monitoring</p>
          </div>
        </div>

        {/* City Branding */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">City of Springfield</h2>
              <p className="text-blue-100">Department of Public Works</p>
            </div>
          </div>
          <p className="text-blue-100 leading-relaxed">
            Leveraging artificial intelligence to modernize urban infrastructure management, 
            enhance citizen services, and build smarter, more responsive communities.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">System Capabilities</h3>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature.icon} size={20} color="white" />
              </div>
              <div>
                <h4 className="font-medium mb-1">{feature.title}</h4>
                <p className="text-blue-100 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12">
        {/* Trust Signals */}
        <div className="border-t border-white border-opacity-20 pt-6 mb-6">
          <h4 className="font-medium mb-4">Security & Compliance</h4>
          <div className="space-y-3">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Icon name={signal.icon} size={16} color="white" />
                <span className="text-blue-100 text-sm">{signal.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">System Status</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-100 text-sm">All Systems Operational</span>
            </div>
          </div>
          <div className="text-blue-100 text-xs">
            Last updated: {new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-blue-100 text-xs mt-6">
          <p>&copy; {new Date().getFullYear()} City of Springfield. All rights reserved.</p>
          <p className="mt-1">Powered by InfraSight AI Technology</p>
        </div>
      </div>
    </div>
  );
};

export default BrandingSection;