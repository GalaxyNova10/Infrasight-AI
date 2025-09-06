import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: 'bg-primary text-primary-foreground',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700'
    };
    return colors[colorType] || colors.primary;
  };

  const getChangeColor = (type) => {
    return type === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <Icon 
                name={changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={getChangeColor(changeType)}
              />
              <span className={`text-sm font-medium ml-1 ${getChangeColor(changeType)}`}>
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;