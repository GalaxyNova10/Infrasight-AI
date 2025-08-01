import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const TrendChart = () => {
  const data = [
    { date: '2025-01-01', detected: 45, resolved: 38, pending: 7 },
    { date: '2025-01-02', detected: 52, resolved: 41, pending: 18 },
    { date: '2025-01-03', detected: 38, resolved: 45, pending: 11 },
    { date: '2025-01-04', detected: 61, resolved: 52, pending: 20 },
    { date: '2025-01-05', detected: 48, resolved: 58, pending: 10 },
    { date: '2025-01-06', detected: 55, resolved: 49, pending: 16 },
    { date: '2025-01-07', detected: 42, resolved: 51, pending: 7 },
    { date: '2025-01-08', detected: 58, resolved: 45, pending: 20 },
    { date: '2025-01-09', detected: 49, resolved: 54, pending: 15 },
    { date: '2025-01-10', detected: 63, resolved: 48, pending: 30 },
    { date: '2025-01-11', detected: 51, resolved: 59, pending: 22 },
    { date: '2025-01-12', detected: 47, resolved: 52, pending: 17 },
    { date: '2025-01-13', detected: 56, resolved: 46, pending: 27 },
    { date: '2025-01-14', detected: 44, resolved: 55, pending: 16 },
    { date: '2025-01-15', detected: 59, resolved: 51, pending: 24 },
    { date: '2025-01-16', detected: 48, resolved: 57, pending: 15 },
    { date: '2025-01-17', detected: 53, resolved: 49, pending: 19 },
    { date: '2025-01-18', detected: 46, resolved: 54, pending: 11 },
    { date: '2025-01-19', detected: 61, resolved: 47, pending: 25 },
    { date: '2025-01-20', detected: 49, resolved: 58, pending: 16 },
    { date: '2025-01-21', detected: 54, resolved: 52, pending: 18 },
    { date: '2025-01-22', detected: 47, resolved: 56, pending: 9 },
    { date: '2025-01-23', detected: 58, resolved: 49, pending: 18 },
    { date: '2025-01-24', detected: 52, resolved: 55, pending: 15 },
    { date: '2025-01-25', detected: 45, resolved: 51, pending: 9 },
    { date: '2025-01-26', detected: 59, resolved: 48, pending: 20 },
    { date: '2025-01-27', detected: 51, resolved: 57, pending: 14 },
    { date: '2025-01-28', detected: 48, resolved: 53, pending: 9 },
    { date: '2025-01-29', detected: 56, resolved: 49, pending: 16 }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="font-medium text-text-primary mb-2">{formatDate(label)}</p>
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
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Issue Detection Trends</h3>
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
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-sm text-text-secondary">Pending</span>
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
              stroke="var(--color-primary)" 
              strokeWidth={2}
              name="Issues Detected"
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              name="Issues Resolved"
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="pending" 
              stroke="var(--color-warning)" 
              strokeWidth={2}
              name="Pending Issues"
              dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-warning)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;