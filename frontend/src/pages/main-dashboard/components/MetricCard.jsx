import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: 'bg-blue-50 text-blue-600 border-blue-200',
      success: 'bg-green-50 text-green-600 border-green-200',
      warning: 'bg-amber-50 text-amber-600 border-amber-200',
      error: 'bg-red-50 text-red-600 border-red-200'
    };
    return colors[colorType] || colors.primary;
  };

  const getChangeColor = (type) => {
    return type === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1 hover-scale">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
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
              <span className="text-sm text-text-secondary ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;