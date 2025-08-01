import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsOverview = () => {
  const metrics = [
    {
      id: 1,
      title: "Total Issues Detected",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: "AlertTriangle",
      color: "text-primary",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      title: "Issues Resolved",
      value: "2,156",
      change: "+8.3%",
      trend: "up",
      icon: "CheckCircle",
      color: "text-success",
      bgColor: "bg-green-50"
    },
    {
      id: 3,
      title: "Average Resolution Time",
      value: "4.2 days",
      change: "-15.2%",
      trend: "down",
      icon: "Clock",
      color: "text-warning",
      bgColor: "bg-amber-50"
    },
    {
      id: 4,
      title: "Active Maintenance Crews",
      value: "24",
      change: "+2",
      trend: "up",
      icon: "Users",
      color: "text-secondary",
      bgColor: "bg-slate-50"
    },
    {
      id: 5,
      title: "Citizen Reports",
      value: "1,234",
      change: "+18.7%",
      trend: "up",
      icon: "MessageSquare",
      color: "text-accent",
      bgColor: "bg-orange-50"
    },
    {
      id: 6,
      title: "AI Detection Accuracy",
      value: "94.8%",
      change: "+2.1%",
      trend: "up",
      icon: "Brain",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {metrics.map((metric) => (
        <div key={metric.id} className="bg-surface border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={metric.icon} size={24} className={metric.color} />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              metric.trend === 'up' ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={metric.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
              />
              <span className="font-medium">{metric.change}</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-1">{metric.value}</h3>
            <p className="text-sm text-text-secondary">{metric.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;