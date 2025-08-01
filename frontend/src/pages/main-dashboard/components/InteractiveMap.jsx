import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMap = () => {
  const [mapView, setMapView] = useState('satellite');
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Mock issue data with coordinates
  const issues = [
    {
      id: 1,
      type: 'pothole',
      severity: 'high',
      location: 'Main St & 5th Ave',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      status: 'pending',
      reportedAt: '2025-01-29T10:30:00Z',
      description: 'Large pothole blocking traffic lane'
    },
    {
      id: 2,
      type: 'water_leak',
      severity: 'critical',
      location: 'Oak Street',
      coordinates: { lat: 40.7614, lng: -73.9776 },
      status: 'in_progress',
      reportedAt: '2025-01-29T09:15:00Z',
      description: 'Water main break detected by AI system'
    },
    {
      id: 3,
      type: 'streetlight',
      severity: 'medium',
      location: 'Park Avenue',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      status: 'resolved',
      reportedAt: '2025-01-29T08:45:00Z',
      description: 'Streetlight outage reported'
    },
    {
      id: 4,
      type: 'garbage_overflow',
      severity: 'medium',
      location: 'Broadway & 42nd',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      status: 'pending',
      reportedAt: '2025-01-29T11:20:00Z',
      description: 'Garbage bin overflow detected'
    }
  ];

  const getIssueColor = (severity) => {
    const colors = {
      critical: '#DC2626',
      high: '#F59E0B',
      medium: '#3B82F6',
      low: '#10B981'
    };
    return colors[severity] || colors.medium;
  };

  const getIssueIcon = (type) => {
    const icons = {
      pothole: 'AlertTriangle',
      water_leak: 'Droplets',
      streetlight: 'Lightbulb',
      garbage_overflow: 'Trash2'
    };
    return icons[type] || 'AlertCircle';
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-elevation-2">
      {/* Map Controls */}
      <div className="p-4 border-b border-border bg-muted">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Infrastructure Map</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={showHeatMap ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowHeatMap(!showHeatMap)}
              iconName="Thermometer"
              iconPosition="left"
            >
              Heat Map
            </Button>
            <select
              value={mapView}
              onChange={(e) => setMapView(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-surface"
            >
              <option value="satellite">Satellite</option>
              <option value="street">Street View</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gray-100">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Infrastructure Map"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=40.7589,-73.9851&z=14&output=embed"
          className="w-full h-full"
        />

        {/* Issue Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${20 + (issue.id * 15)}%`,
                top: `${30 + (issue.id * 10)}%`
              }}
              onClick={() => handleIssueClick(issue)}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse"
                style={{ backgroundColor: getIssueColor(issue.severity) }}
              >
                <Icon name={getIssueIcon(issue.type)} size={16} color="white" />
              </div>
              {issue.severity === 'critical' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
            </div>
          ))}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-surface border border-border rounded-lg p-3 shadow-elevation-2">
          <h4 className="text-sm font-semibold text-text-primary mb-2">Issue Types</h4>
          <div className="space-y-1">
            {[
              { type: 'pothole', label: 'Potholes', color: '#F59E0B' },
              { type: 'water_leak', label: 'Water Leaks', color: '#DC2626' },
              { type: 'streetlight', label: 'Streetlights', color: '#3B82F6' },
              { type: 'garbage_overflow', label: 'Garbage', color: '#10B981' }
            ].map((item) => (
              <div key={item.type} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-text-secondary">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button variant="outline" size="icon" className="bg-surface">
            <Icon name="Plus" size={16} />
          </Button>
          <Button variant="outline" size="icon" className="bg-surface">
            <Icon name="Minus" size={16} />
          </Button>
          <Button variant="outline" size="icon" className="bg-surface">
            <Icon name="Locate" size={16} />
          </Button>
        </div>
      </div>

      {/* Selected Issue Details */}
      {selectedIssue && (
        <div className="p-4 border-t border-border bg-blue-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={getIssueIcon(selectedIssue.type)} size={16} />
                <h4 className="font-semibold text-text-primary capitalize">
                  {selectedIssue.type.replace('_', ' ')}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedIssue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  selectedIssue.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                  selectedIssue.severity === 'medium'? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {selectedIssue.severity}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-1">{selectedIssue.location}</p>
              <p className="text-sm text-text-primary">{selectedIssue.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedIssue(null)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;