import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const VideoFeedPanel = () => {
  const [selectedFeed, setSelectedFeed] = useState(null);

  // Mock video feed data
  const videoFeeds = [
    {
      id: 1,
      name: 'Anna Salai Camera 01',
      location: 'Anna Salai, Chennai',
      status: 'active',
      aiDetections: 3,
      lastDetection: '2 min ago',
      thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
      issues: ['pothole', 'garbage_overflow']
    },
    {
      id: 2,
      name: 'Marina Beach Camera 02',
      location: 'Marina Beach, Chennai',
      status: 'active',
      aiDetections: 1,
      lastDetection: '5 min ago',
      thumbnail: 'https://images.unsplash.com/photo-1573160813959-df05c1b2e5d0?w=300&h=200&fit=crop',
      issues: ['water_leak']
    },
    {
      id: 3,
      name: 'T. Nagar Camera 03',
      location: 'T. Nagar, Chennai',
      status: 'maintenance',
      aiDetections: 0,
      lastDetection: '1 hour ago',
      thumbnail: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=300&h=200&fit=crop',
      issues: []
    },
    {
      id: 4,
      name: 'Besant Nagar Camera 04',
      location: 'Besant Nagar, Chennai',
      status: 'active',
      aiDetections: 2,
      lastDetection: '1 min ago',
      thumbnail: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=300&h=200&fit=crop',
      issues: ['streetlight', 'pothole']
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-amber-100 text-amber-800',
      offline: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.offline;
  };

  const getIssueIcon = (issue) => {
    const icons = {
      pothole: 'AlertTriangle',
      water_leak: 'Droplets',
      streetlight: 'Lightbulb',
      garbage_overflow: 'Trash2'
    };
    return icons[issue] || 'AlertCircle';
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-elevation-2">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Live Video Feeds</h3>
          <Button variant="outline" size="sm" iconName="Video" iconPosition="left">
            View All
          </Button>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          {videoFeeds.filter(feed => feed.status === 'active').length} of {videoFeeds.length} cameras active
        </p>
      </div>

      {/* Video Feed List */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {videoFeeds.map((feed) => (
          <div
            key={feed.id}
            className={`border border-border rounded-lg p-3 cursor-pointer transition-smooth hover:shadow-elevation-1 ${
              selectedFeed?.id === feed.id ? 'ring-2 ring-primary bg-blue-50' : 'bg-surface'
            }`}
            onClick={() => setSelectedFeed(feed)}
          >
            <div className="flex items-start space-x-3">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={feed.thumbnail}
                    alt={feed.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Live Indicator */}
                {feed.status === 'active' && (
                  <div className="absolute -top-1 -right-1 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span>LIVE</span>
                  </div>
                )}
              </div>

              {/* Feed Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-text-primary text-sm truncate">
                    {feed.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feed.status)}`}>
                    {feed.status}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-2 truncate">{feed.location}</p>

                {/* AI Detections */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Brain" size={14} className="text-primary" />
                    <span className="text-xs text-text-secondary">
                      {feed.aiDetections} detections
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">{feed.lastDetection}</span>
                </div>

                {/* Issue Icons */}
                {feed.issues.length > 0 && (
                  <div className="flex items-center space-x-1 mt-2">
                    {feed.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center"
                        title={issue.replace('_', ' ')}
                      >
                        <Icon name={getIssueIcon(issue)} size={12} className="text-amber-600" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Feed Details */}
      {selectedFeed && (
        <div className="border-t border-border p-4 bg-muted">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-text-primary">{selectedFeed.name}</h4>
            <Button variant="outline" size="sm" iconName="ExternalLink">
              Full View
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Location:</span>
              <p className="text-text-primary font-medium">{selectedFeed.location}</p>
            </div>
            <div>
              <span className="text-text-secondary">Status:</span>
              <p className="text-text-primary font-medium capitalize">{selectedFeed.status}</p>
            </div>
            <div>
              <span className="text-text-secondary">AI Detections:</span>
              <p className="text-text-primary font-medium">{selectedFeed.aiDetections} today</p>
            </div>
            <div>
              <span className="text-text-secondary">Last Detection:</span>
              <p className="text-text-primary font-medium">{selectedFeed.lastDetection}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeedPanel;