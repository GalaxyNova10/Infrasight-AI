import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const DepartmentPerformance = () => {
  const data = [
    {
      department: 'Public Works Dept.',
      detected: 520,
      resolved: 480,
      avgResolutionTime: 3.5,
      efficiency: 92.3
    },
    {
      department: 'Water Supply & Sewerage',
      detected: 350,
      resolved: 330,
      avgResolutionTime: 2.9,
      efficiency: 94.3
    },
    {
      department: 'Traffic & Roads',
      detected: 680,
      resolved: 610,
      avgResolutionTime: 4.2,
      efficiency: 89.7
    },
    {
      department: 'Parks & Green Spaces',
      detected: 180,
      resolved: 165,
      avgResolutionTime: 5.0,
      efficiency: 91.7
    },
    {
      department: 'Solid Waste Management',
      detected: 280,
      resolved: 265,
      avgResolutionTime: 2.1,
      efficiency: 94.6
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Detected: <span className="font-medium text-primary">{data.detected}</span>
            </p>
            <p className="text-sm text-gray-600">
              Resolved: <span className="font-medium text-green-600">{data.resolved}</span>
            </p>
            <p className="text-sm text-gray-600">
              Avg Resolution: <span className="font-medium text-yellow-600">{data.avgResolutionTime} days</span>
            </p>
            <p className="text-sm text-gray-600">
              Efficiency: <span className="font-medium text-purple-600">{data.efficiency}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Building2" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Department Performance</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-text-secondary">Detected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm text-text-secondary">Resolved</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="department" 
              stroke="#6B7280"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="detected" 
              fill="var(--color-primary)" 
              name="Issues Detected"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="resolved" 
              fill="var(--color-success)" 
              name="Issues Resolved"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        {data.map((dept, index) => (
          <div key={index} className="text-center p-3 bg-muted rounded-lg">
            <p className="text-xs text-text-secondary mb-1">{dept.department}</p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-primary">{dept.efficiency}% Efficiency</p>
              <p className="text-xs text-text-secondary">{dept.avgResolutionTime}d avg resolution</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentPerformance;