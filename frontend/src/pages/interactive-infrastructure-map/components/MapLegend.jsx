import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapLegend = ({ isVisible, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const issueTypes = [
    { 
      type: 'potholes', 
      label: 'Potholes', 
      color: 'bg-red-500', 
      icon: 'AlertTriangle',
      count: 127,
      description: 'Road surface damage and holes'
    },
    { 
      type: 'leaks', 
      label: 'Water Leaks', 
      color: 'bg-blue-500', 
      icon: 'Droplets',
      count: 43,
      description: 'Water main breaks and pipe leaks'
    },
    { 
      type: 'lighting', 
      label: 'Street Lighting', 
      color: 'bg-yellow-500', 
      icon: 'Lightbulb',
      count: 89,
      description: 'Broken or malfunctioning street lights'
    },
    { 
      type: 'waste', 
      label: 'Waste Management', 
      color: 'bg-green-500', 
      icon: 'Trash2',
      count: 56,
      description: 'Overflowing bins and waste issues'
    }
  ];

  const severityLevels = [
    { level: 'critical', label: 'Critical', color: 'bg-red-600', size: 'w-4 h-4' },
    { level: 'high', label: 'High', color: 'bg-orange-500', size: 'w-3.5 h-3.5' },
    { level: 'medium', label: 'Medium', color: 'bg-yellow-500', size: 'w-3 h-3' },
    { level: 'low', label: 'Low', color: 'bg-green-500', size: 'w-2.5 h-2.5' }
  ];

  const clusterSizes = [
    { range: '2-5', label: '2-5 Issues', size: 'w-6 h-6', color: 'bg-blue-400' },
    { range: '6-10', label: '6-10 Issues', size: 'w-8 h-8', color: 'bg-blue-500' },
    { range: '11+', label: '11+ Issues', size: 'w-10 h-10', color: 'bg-blue-600' }
  ];

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-1000">
        <Button
          variant="default"
          size="sm"
          iconName="Info"
          iconPosition="left"
          onClick={onToggle}
        >
          Show Legend
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-1000 bg-surface border border-border rounded-lg shadow-elevation-3 max-w-xs">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="Info" size={16} />
            <span>Map Legend</span>
          </h3>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6"
            >
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-6 w-6"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-4">
          {/* Issue Types */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Issue Types</h4>
            <div className="space-y-2">
              {issueTypes.map((item) => (
                <div key={item.type} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 flex-1">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <Icon name={item.icon} size={14} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{item.label}</span>
                  </div>
                  <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Levels */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Severity Levels</h4>
            <div className="space-y-2">
              {severityLevels.map((item) => (
                <div key={item.level} className="flex items-center space-x-2">
                  <div className={`${item.size} rounded-full ${item.color}`} />
                  <span className="text-sm text-text-primary capitalize">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Marker size indicates severity level
            </p>
          </div>

          {/* Cluster Sizes */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Cluster Markers</h4>
            <div className="space-y-2">
              {clusterSizes.map((item) => (
                <div key={item.range} className="flex items-center space-x-2">
                  <div className={`${item.size} rounded-full ${item.color} flex items-center justify-center`}>
                    <span className="text-white text-xs font-medium">
                      {item.range === '11+' ? '11' : item.range.split('-')[1]}
                    </span>
                  </div>
                  <span className="text-sm text-text-primary">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Click clusters to zoom in and expand
            </p>
          </div>

          {/* Heat Map */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Heat Map</h4>
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-3 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 rounded" />
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>Low Density</span>
              <span>High Density</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center space-x-2 text-xs text-text-secondary">
              <Icon name="Clock" size={12} />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-text-secondary mt-1">
              <Icon name="MapPin" size={12} />
              <span>Total issues: {issueTypes.reduce((sum, item) => sum + item.count, 0)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;