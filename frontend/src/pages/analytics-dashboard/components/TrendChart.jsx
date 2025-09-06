import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const TrendChart = () => {
  const data = [
    { date: '2025-07-01', detected: 180, resolved: 150, pending: 30 },
    { date: '2025-07-02', detected: 195, resolved: 160, pending: 35 },
    { date: '2025-07-03', detected: 170, resolved: 175, pending: 15 },
    { date: '2025-07-04', detected: 210, resolved: 180, pending: 30 },
    { date: '2025-07-05', detected: 185, resolved: 200, pending: 5 },
    { date: '2025-07-06', detected: 200, resolved: 190, pending: 10 },
    { date: '2025-07-07', detected: 175, resolved: 190, pending: 5 },
    { date: '2025-07-08', detected: 205, resolved: 180, pending: 25 },
    { date: '2025-07-09', detected: 190, resolved: 195, pending: 15 },
    { date: '2025-07-10', detected: 220, resolved: 185, pending: 35 },
    { date: '2025-07-11', detected: 195, resolved: 210, pending: 15 },
    { date: '2025-07-12', detected: 180, resolved: 190, pending: 10 },
    { date: '2025-07-13', detected: 205, resolved: 175, pending: 30 },
    { date: '2025-07-14', detected: 170, resolved: 200, pending: 5 },
    { date: '2025-07-15', detected: 210, resolved: 190, pending: 20 },
    { date: '2025-07-16', detected: 185, resolved: 205, pending: 5 },
    { date: '2025-07-17', detected: 195, resolved: 185, pending: 10 },
    { date: '2025-07-18', detected: 180, resolved: 195, pending: 5 },
    { date: '2025-07-19', detected: 215, resolved: 180, pending: 35 },
    { date: '2025-07-20', detected: 190, resolved: 205, pending: 15 },
    { date: '2025-07-21', detected: 200, resolved: 190, pending: 10 },
    { date: '2025-07-22', detected: 180, resolved: 200, pending: 5 },
    { date: '2025-07-23', detected: 205, resolved: 185, pending: 20 },
    { date: '2025-07-24', detected: 195, resolved: 200, pending: 5 },
    { date: '2025-07-25', detected: 175, resolved: 190, pending: 5 },
    { date: '2025-07-26', detected: 210, resolved: 180, pending: 30 },
    { date: '2025-07-27', detected: 190, resolved: 200, pending: 10 },
    { date: '2025-07-28', detected: 185, resolved: 195, pending: 10 },
    { date: '2025-07-29', detected: 200, resolved: 190, pending: 10 }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-800">Issue Detection Trends</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-gray-600">Detected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Resolved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="detected" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Issues Detected"
              dot={{ fill: 'hsl(var(--primary))' , strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))' , strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke="#22C55E" 
              strokeWidth={2}
              name="Issues Resolved"
              dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#22C55E', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="pending" 
              stroke="#FBBF24" 
              strokeWidth={2}
              name="Pending Issues"
              dot={{ fill: '#FBBF24', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#FBBF24', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;