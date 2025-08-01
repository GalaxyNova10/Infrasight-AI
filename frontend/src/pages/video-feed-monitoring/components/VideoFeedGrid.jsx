import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoFeedGrid = ({ 
  selectedFeeds, 
  gridLayout, 
  onFeedSelect, 
  onDetectionClick,
  detectionSensitivity 
}) => {
  const [feedStatuses, setFeedStatuses] = useState({});

  // Mock video feed data
  const mockFeeds = [
    {
      id: 'cam_001',
      name: 'Main Street & Oak Ave',
      location: 'Downtown District',
      status: 'active',
      recording: true,
      lastDetection: new Date(Date.now() - 300000),
      detections: [
        {
          id: 'det_001',
          type: 'pothole',
          confidence: 0.87,
          bbox: { x: 45, y: 60, width: 15, height: 10 },
          timestamp: new Date(Date.now() - 120000)
        }
      ]
    },
    {
      id: 'cam_002',
      name: 'City Hall Plaza',
      location: 'Government District',
      status: 'active',
      recording: true,
      lastDetection: new Date(Date.now() - 600000),
      detections: [
        {
          id: 'det_002',
          type: 'garbage_overflow',
          confidence: 0.92,
          bbox: { x: 30, y: 40, width: 20, height: 25 },
          timestamp: new Date(Date.now() - 180000)
        }
      ]
    },
    {
      id: 'cam_003',
      name: 'Bridge Overpass #7',
      location: 'Industrial Zone',
      status: 'active',
      recording: false,
      lastDetection: null,
      detections: []
    },
    {
      id: 'cam_004',
      name: 'Park Avenue & 5th St',
      location: 'Residential Area',
      status: 'maintenance',
      recording: false,
      lastDetection: new Date(Date.now() - 1800000),
      detections: []
    }
  ];

  useEffect(() => {
    // Simulate real-time feed status updates
    const interval = setInterval(() => {
      setFeedStatuses(prev => ({
        ...prev,
        [`cam_${Math.floor(Math.random() * 4) + 1}`]: {
          lastUpdate: new Date(),
          signal: Math.random() > 0.1 ? 'strong' : 'weak'
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getGridClass = () => {
    switch (gridLayout) {
      case '2x2':
        return 'grid-cols-2 grid-rows-2';
      case '3x3':
        return 'grid-cols-3 grid-rows-3';
      case '1x1':
        return 'grid-cols-1 grid-rows-1';
      default:
        return 'grid-cols-2 grid-rows-2';
    }
  };

  const getDetectionColor = (type) => {
    switch (type) {
      case 'pothole':
        return 'border-yellow-500 bg-yellow-500/20';
      case 'garbage_overflow':
        return 'border-red-500 bg-red-500/20';
      case 'water_leak':
        return 'border-blue-500 bg-blue-500/20';
      case 'streetlight_fault':
        return 'border-purple-500 bg-purple-500/20';
      default:
        return 'border-gray-500 bg-gray-500/20';
    }
  };

  const formatTimestamp = (date) => {
    if (!date) return 'No data';
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Grid Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center space-x-3">
          <Icon name="Video" size={20} className="text-primary" />
          <h3 className="font-semibold text-text-primary">Live Video Feeds</h3>
          <span className="text-sm text-text-secondary">
            {selectedFeeds.length} of {mockFeeds.length} active
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Maximize2" iconPosition="left">
            Fullscreen
          </Button>
          <Button variant="outline" size="sm" iconName="Settings" iconPosition="left">
            Configure
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className={`grid ${getGridClass()} gap-2 p-4 min-h-[600px]`}>
        {selectedFeeds.slice(0, gridLayout === '3x3' ? 9 : 4).map((feedId, index) => {
          const feed = mockFeeds.find(f => f.id === feedId) || mockFeeds[index];
          if (!feed) return null;

          return (
            <div
              key={feed.id}
              className="relative bg-black rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              onClick={() => onFeedSelect(feed.id)}
            >
              {/* Video Placeholder */}
              <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {feed.status === 'active' ? (
                  <div className="text-center">
                    <Icon name="Video" size={32} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Live Feed</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Icon name="VideoOff" size={32} className="text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Offline</p>
                  </div>
                )}
              </div>

              {/* Detection Overlays */}
              {feed.detections.map((detection) => (
                <div
                  key={detection.id}
                  className={`absolute border-2 ${getDetectionColor(detection.type)} cursor-pointer`}
                  style={{
                    left: `${detection.bbox.x}%`,
                    top: `${detection.bbox.y}%`,
                    width: `${detection.bbox.width}%`,
                    height: `${detection.bbox.height}%`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetectionClick(detection, feed);
                  }}
                >
                  <div className="absolute -top-8 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {detection.type.replace('_', ' ')} ({Math.round(detection.confidence * 100)}%)
                  </div>
                </div>
              ))}

              {/* Feed Info Overlay */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-medium text-sm">{feed.name}</h4>
                    <p className="text-gray-300 text-xs">{feed.location}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {feed.recording && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-white text-xs">REC</span>
                      </div>
                    )}
                    <div className={`w-2 h-2 rounded-full ${
                      feed.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white">
                    {formatTimestamp(new Date())}
                  </span>
                  {feed.detections.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="AlertTriangle" size={12} className="text-yellow-400" />
                      <span className="text-yellow-400">
                        {feed.detections.length} detection{feed.detections.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Signal Strength Indicator */}
              <div className="absolute top-3 right-3">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className={`w-1 h-3 rounded-sm ${
                        feedStatuses[feed.id]?.signal === 'weak' && bar > 1 ?'bg-gray-500' :'bg-white'
                      }`}
                      style={{ height: `${bar * 4 + 4}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty Grid Slots */}
        {Array.from({ 
          length: (gridLayout === '3x3' ? 9 : 4) - selectedFeeds.length 
        }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center min-h-[200px]"
          >
            <div className="text-center">
              <Icon name="Plus" size={24} className="text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary text-sm">Add Feed</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detection Summary */}
      {selectedFeeds.some(feedId => {
        const feed = mockFeeds.find(f => f.id === feedId);
        return feed && feed.detections.length > 0;
      }) && (
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm text-text-secondary">Potholes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-text-secondary">Garbage Overflow</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-text-secondary">Water Leaks</span>
              </div>
            </div>
            <Button variant="outline" size="sm" iconName="Filter" iconPosition="left">
              Filter Detections
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeedGrid;