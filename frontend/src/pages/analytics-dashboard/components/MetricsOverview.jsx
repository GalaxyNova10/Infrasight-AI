import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsOverview = () => {
  const metrics = [
    {
      id: 1,
      title: "Total Issues Detected (Chennai)",
      value: "3,125",
      change: "+15.2%",
      trend: "up",
      icon: "AlertTriangle",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: 2,
      title: "Issues Resolved (Chennai)",
      value: "2,580",
      change: "+10.1%",
      trend: "up",
      icon: "CheckCircle",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: 3,
      title: "Average Resolution Time (Chennai)",
      value: "3.8 days",
      change: "-18.5%",
      trend: "down",
      icon: "Clock",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      id: 4,
      title: "Active GCC Crews (Chennai)",
      value: "30",
      change: "+3",
      trend: "up",
      icon: "Users",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: 5,
      title: "Citizen Reports (Chennai)",
      value: "1,567",
      change: "+22.3%",
      trend: "up",
      icon: "MessageSquare",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      id: 6,
      title: "AI Detection Accuracy (Chennai)",
      value: "96.1%",
      change: "+1.3%",
      trend: "up",
      icon: "Brain",
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {metrics.map((metric) => (
        <div key={metric.id} className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${metric.bgColor} rounded-full flex items-center justify-center`}>
              <Icon name={metric.icon} size={24} className={metric.color} />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <Icon 
                name={metric.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
              />
              <span className="font-medium">{metric.change}</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-500">{metric.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;