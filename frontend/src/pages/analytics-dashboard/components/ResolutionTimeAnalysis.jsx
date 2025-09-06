import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const ResolutionTimeAnalysis = () => {
  const data = [
    { month: 'Jan 2025', avgTime: 4.5, target: 3.5, resolved: 350 },
    { month: 'Feb 2025', avgTime: 4.2, target: 3.5, resolved: 380 },
    { month: 'Mar 2025', avgTime: 4.0, target: 3.5, resolved: 410 },
    { month: 'Apr 2025', avgTime: 3.8, target: 3.5, resolved: 430 },
    { month: 'May 2025', avgTime: 3.6, target: 3.5, resolved: 450 },
    { month: 'Jun 2025', avgTime: 3.7, target: 3.5, resolved: 420 },
    { month: 'Jul 2025', avgTime: 3.5, target: 3.5, resolved: 480 }
  ];

  const departmentData = [
    {
      department: 'Water Supply & Sewerage',
      avgTime: 2.5,
      target: 3.0,
      performance: 'excellent',
      trend: 'improving',
      resolved: 330
    },
    {
      department: 'Public Works Dept.',
      avgTime: 3.0,
      target: 3.5,
      performance: 'good',
      trend: 'stable',
      resolved: 480
    },
    {
      department: 'Traffic & Roads',
      avgTime: 3.9,
      target: 3.5,
      performance: 'fair',
      trend: 'improving',
      resolved: 610
    },
    {
      department: 'Parks & Green Spaces',
      avgTime: 4.8,
      target: 4.0,
      performance: 'fair',
      trend: 'declining',
      resolved: 165
    },
    {
      department: 'Solid Waste Management',
      avgTime: 1.8,
      target: 2.0,
      performance: 'excellent',
      trend: 'stable',
      resolved: 265
    }
  ];

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getPerformanceBg = (performance) => {
    switch (performance) {
      case 'excellent': return 'bg-green-50';
      case 'good': return 'bg-blue-50';
      case 'fair': return 'bg-amber-50';
      case 'poor': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return 'TrendingUp';
      case 'declining': return 'TrendingDown';
      case 'stable': return 'Minus';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return 'text-success';
      case 'declining': return 'text-error';
      case 'stable': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-text-secondary">
              Avg Resolution: <span className="font-medium text-primary">{data.avgTime} days</span>
            </p>
            <p className="text-sm text-text-secondary">
              Target: <span className="font-medium text-warning">{data.target} days</span>
            </p>
            <p className="text-sm text-text-secondary">
              Issues Resolved: <span className="font-medium text-success">{data.resolved}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Clock" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-gray-800">Resolution Time Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Monthly Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="avgTime"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(var(--warning))"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-600">Actual Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-yellow-500"></div>
              <span className="text-sm text-gray-600">Target Time</span>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Department Performance</h4>
          <div className="space-y-3">
            {departmentData.map((dept, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getPerformanceBg(dept.performance)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-800 text-sm">{dept.department}</h5>
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getTrendIcon(dept.trend)} 
                      size={14} 
                      className={getTrendColor(dept.trend)} 
                    />
                    <span className={`text-xs font-medium ${getPerformanceColor(dept.performance)}`}>
                      {dept.performance.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Avg: </span>
                    <span className="font-semibold text-gray-800">{dept.avgTime} days</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Target: </span>
                    <span className="font-medium text-yellow-600">{dept.target} days</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Resolved: </span>
                    <span className="font-medium text-green-600">{dept.resolved}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Performance vs Target</span>
                    <span>{dept.avgTime <= dept.target ? 'On Target' : 'Above Target'}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        dept.avgTime <= dept.target ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ 
                        width: `${Math.min((dept.target / dept.avgTime) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <Icon name="Target" size={24} className="text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-gray-800">3.8 days</p>
          <p className="text-sm text-gray-600">Current Average</p>
        </div>
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <Icon name="CheckCircle" size={24} className="text-green-500 mx-auto mb-2" />
          <p className="text-lg font-bold text-gray-800">78%</p>
          <p className="text-sm text-gray-600">Within Target</p>
        </div>
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <Icon name="TrendingUp" size={24} className="text-yellow-500 mx-auto mb-2" />
          <p className="text-lg font-bold text-gray-800">-15%</p>
          <p className="text-sm text-gray-600">Improvement</p>
        </div>
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <Icon name="Award" size={24} className="text-purple-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-gray-800">Water Utilities</p>
          <p className="text-sm text-gray-600">Best Performer</p>
        </div>
      </div>
    </div>
  );
};

export default ResolutionTimeAnalysis;