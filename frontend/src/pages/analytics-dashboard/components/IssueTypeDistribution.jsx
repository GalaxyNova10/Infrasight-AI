import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const IssueTypeDistribution = () => {
  const data = [
    { name: 'Potholes', value: 847, color: '#1E40AF', icon: 'Construction' },
    { name: 'Water Leaks', value: 623, color: '#059669', icon: 'Droplets' },
    { name: 'Streetlight Issues', value: 456, color: '#D97706', icon: 'Lightbulb' },
    { name: 'Garbage Overflow', value: 389, color: '#DC2626', icon: 'Trash2' },
    { name: 'Road Damage', value: 312, color: '#7C3AED', icon: 'AlertTriangle' },
    { name: 'Other', value: 220, color: '#64748B', icon: 'MoreHorizontal' }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="font-medium text-text-primary">{data.name}</p>
          <p className="text-sm text-text-secondary">
            {data.value} issues ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="PieChart" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Issue Type Distribution</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/2 lg:pl-6">
          <div className="space-y-4">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex items-center space-x-2">
                      <Icon name={item.icon} size={16} className="text-text-secondary" />
                      <span className="text-sm font-medium text-text-primary">{item.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">{item.value}</p>
                    <p className="text-xs text-text-secondary">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Key Insights</span>
            </div>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Potholes represent 29.8% of all detected issues</li>
              <li>• Water-related issues account for 21.9% of reports</li>
              <li>• Infrastructure lighting needs attention (16.0%)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueTypeDistribution;