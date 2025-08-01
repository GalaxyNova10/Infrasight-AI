import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationBenefits = () => {
  const benefits = [
    {
      icon: 'AlertTriangle',
      title: 'Report Issues Instantly',
      description: 'Quickly report potholes, broken streetlights, and other infrastructure problems with photo evidence and GPS location.'
    },
    {
      icon: 'Bell',
      title: 'Real-time Updates',
      description: 'Get notified when your reported issues are acknowledged, in progress, or resolved by city maintenance teams.'
    },
    {
      icon: 'MapPin',
      title: 'Track Local Issues',
      description: 'Stay informed about infrastructure problems and improvements happening in your neighborhood and city.'
    },
    {
      icon: 'Users',
      title: 'Community Engagement',
      description: 'Connect with fellow residents, support community initiatives, and participate in local infrastructure discussions.'
    },
    {
      icon: 'BarChart3',
      title: 'City Transparency',
      description: 'Access public dashboards showing city maintenance progress, budget allocation, and infrastructure improvement metrics.'
    },
    {
      icon: 'Shield',
      title: 'Verified Reporting',
      description: 'Your reports are validated by AI systems and verified by city officials for accurate and efficient problem resolution.'
    }
  ];

  return (
    <div className="bg-surface rounded-lg shadow-elevation-2 p-6 lg:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Why Join InfraSight AI?
        </h2>
        <p className="text-text-secondary">
          Become part of a smarter, more connected community where your voice helps improve city infrastructure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={benefit.icon} size={20} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-2">{benefit.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">2,847</div>
            <div className="text-sm text-text-secondary">Issues Resolved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">15,623</div>
            <div className="text-sm text-text-secondary">Active Citizens</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">98%</div>
            <div className="text-sm text-text-secondary">Response Rate</div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-6 text-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Lock" size={16} className="text-success" />
            <span>Privacy Protected</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span>City Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationBenefits;