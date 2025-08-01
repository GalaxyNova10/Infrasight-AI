import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PredictiveInsights = () => {
  const predictions = [
    {
      id: 1,
      type: 'maintenance',
      title: 'Bridge #47 Maintenance Required',
      description: 'AI analysis indicates structural stress patterns suggesting maintenance needed within 30 days',
      priority: 'high',
      confidence: 87,
      estimatedDate: '2025-02-28',
      location: 'Downtown District',
      icon: 'Bridge',
      actionRequired: 'Schedule inspection and maintenance crew'
    },
    {
      id: 2,
      type: 'seasonal',
      title: 'Increased Pothole Formation Expected',
      description: 'Weather patterns and historical data suggest 40% increase in pothole formation next month',
      priority: 'medium',
      confidence: 92,
      estimatedDate: '2025-03-15',
      location: 'Citywide',
      icon: 'CloudSnow',
      actionRequired: 'Prepare additional asphalt and crew scheduling'
    },
    {
      id: 3,
      type: 'equipment',
      title: 'Water Main Failure Risk',
      description: 'Pressure monitoring indicates potential failure in aging infrastructure on Oak Street',
      priority: 'critical',
      confidence: 78,
      estimatedDate: '2025-02-15',
      location: 'Residential North',
      icon: 'Droplets',
      actionRequired: 'Immediate inspection and replacement planning'
    },
    {
      id: 4,
      type: 'traffic',
      title: 'Traffic Light System Optimization',
      description: 'AI suggests timing adjustments could reduce intersection issues by 25%',
      priority: 'low',
      confidence: 94,
      estimatedDate: '2025-02-10',
      location: 'Commercial District',
      icon: 'Traffic',
      actionRequired: 'Review and implement timing adjustments'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'high': return 'bg-amber-50 border-amber-200';
      case 'medium': return 'bg-blue-50 border-blue-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'maintenance': return 'Wrench';
      case 'seasonal': return 'Calendar';
      case 'equipment': return 'AlertTriangle';
      case 'traffic': return 'Car';
      default: return 'Info';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Brain" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Predictive Insights</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Settings" iconSize={16}>
            Configure AI
          </Button>
          <Button variant="outline" size="sm" iconName="Download" iconSize={16}>
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className={`border rounded-lg p-5 ${getPriorityBg(prediction.priority)} hover:shadow-elevation-2 transition-smooth`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  prediction.priority === 'critical' ? 'bg-error' :
                  prediction.priority === 'high' ? 'bg-warning' :
                  prediction.priority === 'medium' ? 'bg-primary' : 'bg-success'
                }`}>
                  <Icon name={prediction.icon} size={20} color="white" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm">{prediction.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Icon name={getTypeIcon(prediction.type)} size={12} className="text-text-secondary" />
                    <span className="text-xs text-text-secondary capitalize">{prediction.type}</span>
                  </div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(prediction.priority)}`}>
                {prediction.priority.toUpperCase()}
              </div>
            </div>

            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              {prediction.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Confidence Level:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                  <span className="font-medium text-text-primary">{prediction.confidence}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Expected Date:</span>
                <span className="font-medium text-text-primary">{formatDate(prediction.estimatedDate)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Location:</span>
                <span className="font-medium text-text-primary">{prediction.location}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-text-primary mb-1">Recommended Action:</p>
                  <p className="text-xs text-text-secondary">{prediction.actionRequired}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Button variant="default" size="sm" className="flex-1">
                Create Work Order
              </Button>
              <Button variant="outline" size="sm" iconName="Calendar" iconSize={16}>
                Schedule
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Info" size={16} className="text-primary" />
          <h4 className="font-medium text-primary">AI Model Performance</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="font-semibold text-text-primary">89.2%</p>
            <p className="text-text-secondary">Prediction Accuracy</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-text-primary">2,847</p>
            <p className="text-text-secondary">Data Points Analyzed</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-text-primary">24/7</p>
            <p className="text-text-secondary">Continuous Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveInsights;