import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GeographicHeatMap = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const districts = [
    {
      id: 1,
      name: 'Downtown District',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      issueCount: 342,
      severity: 'high',
      color: '#DC2626',
      issues: {
        potholes: 89,
        waterLeaks: 67,
        streetlights: 78,
        garbage: 56,
        other: 52
      }
    },
    {
      id: 2,
      name: 'Residential North',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      issueCount: 156,
      severity: 'medium',
      color: '#D97706',
      issues: {
        potholes: 45,
        waterLeaks: 23,
        streetlights: 34,
        garbage: 28,
        other: 26
      }
    },
    {
      id: 3,
      name: 'Industrial Zone',
      coordinates: { lat: 40.7282, lng: -74.0776 },
      issueCount: 234,
      severity: 'high',
      color: '#DC2626',
      issues: {
        potholes: 78,
        waterLeaks: 45,
        streetlights: 42,
        garbage: 38,
        other: 31
      }
    },
    {
      id: 4,
      name: 'Commercial District',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      issueCount: 189,
      severity: 'medium',
      color: '#D97706',
      issues: {
        potholes: 52,
        waterLeaks: 34,
        streetlights: 41,
        garbage: 35,
        other: 27
      }
    },
    {
      id: 5,
      name: 'Suburban East',
      coordinates: { lat: 40.7614, lng: -73.9776 },
      issueCount: 98,
      severity: 'low',
      color: '#059669',
      issues: {
        potholes: 28,
        waterLeaks: 15,
        streetlights: 22,
        garbage: 18,
        other: 15
      }
    },
    {
      id: 6,
      name: 'Waterfront',
      coordinates: { lat: 40.7505, lng: -74.0134 },
      issueCount: 123,
      severity: 'medium',
      color: '#D97706',
      issues: {
        potholes: 35,
        waterLeaks: 28,
        streetlights: 25,
        garbage: 20,
        other: 15
      }
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-50';
      case 'medium': return 'bg-amber-50';
      case 'low': return 'bg-green-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Map" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Geographic Heat Map</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Maximize2" iconSize={16}>
            Full Screen
          </Button>
          <Button variant="outline" size="sm" iconName="Download" iconSize={16}>
            Export Map
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <div className="relative bg-slate-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Infrastructure Issues Heat Map"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=40.7589,-73.9851&z=12&output=embed"
              className="border-0"
            />
            
            {/* Overlay with district markers */}
            <div className="absolute inset-0 pointer-events-none">
              {districts.map((district) => (
                <div
                  key={district.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                  style={{
                    left: `${20 + (district.id * 15)}%`,
                    top: `${30 + (district.id * 8)}%`
                  }}
                  onClick={() => setSelectedDistrict(district)}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: district.color }}
                  >
                    {district.issueCount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Low (&lt;100)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-warning rounded-full"></div>
              <span className="text-sm text-text-secondary">Medium (100-200)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-error rounded-full"></div>
              <span className="text-sm text-text-secondary">High (&gt;200)</span>
            </div>
          </div>
        </div>

        {/* District List */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary mb-4">District Overview</h4>
          {districts.map((district) => (
            <div
              key={district.id}
              className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
                selectedDistrict?.id === district.id
                  ? 'border-primary bg-blue-50' :'border-border bg-surface hover:bg-muted'
              }`}
              onClick={() => setSelectedDistrict(district)}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-text-primary text-sm">{district.name}</h5>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBg(district.severity)} ${getSeverityColor(district.severity)}`}>
                  {district.severity.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-text-primary">{district.issueCount}</span>
                <span className="text-xs text-text-secondary">total issues</span>
              </div>
            </div>
          ))}

          {/* Selected District Details */}
          {selectedDistrict && (
            <div className="mt-6 p-4 bg-blue-50 border border-primary rounded-lg">
              <h5 className="font-medium text-primary mb-3">{selectedDistrict.name} Details</h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Potholes:</span>
                  <span className="font-medium text-text-primary">{selectedDistrict.issues.potholes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Water Leaks:</span>
                  <span className="font-medium text-text-primary">{selectedDistrict.issues.waterLeaks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Streetlights:</span>
                  <span className="font-medium text-text-primary">{selectedDistrict.issues.streetlights}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Garbage:</span>
                  <span className="font-medium text-text-primary">{selectedDistrict.issues.garbage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Other:</span>
                  <span className="font-medium text-text-primary">{selectedDistrict.issues.other}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeographicHeatMap;