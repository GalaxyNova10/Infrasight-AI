import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FeedDirectory = ({ onFeedToggle, selectedFeeds, onFeedSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);

  // Mock camera feed directory
  const cameraFeeds = [
    {
      id: 'cam_001',
      name: 'Main Street & Oak Ave',
      location: 'Downtown District',
      status: 'active',
      type: 'traffic',
      isFavorite: true,
      lastDetection: new Date(Date.now() - 300000),
      detectionCount: 3,
      signalStrength: 'strong'
    },
    {
      id: 'cam_002',
      name: 'City Hall Plaza',
      location: 'Government District',
      status: 'active',
      type: 'security',
      isFavorite: true,
      lastDetection: new Date(Date.now() - 600000),
      detectionCount: 1,
      signalStrength: 'strong'
    },
    {
      id: 'cam_003',
      name: 'Bridge Overpass #7',
      location: 'Industrial Zone',
      status: 'active',
      type: 'infrastructure',
      isFavorite: false,
      lastDetection: null,
      detectionCount: 0,
      signalStrength: 'medium'
    },
    {
      id: 'cam_004',
      name: 'Park Avenue & 5th St',
      location: 'Residential Area',
      status: 'maintenance',
      type: 'traffic',
      isFavorite: false,
      lastDetection: new Date(Date.now() - 1800000),
      detectionCount: 0,
      signalStrength: 'weak'
    },
    {
      id: 'cam_005',
      name: 'Shopping District Central',
      location: 'Commercial Zone',
      status: 'active',
      type: 'security',
      isFavorite: true,
      lastDetection: new Date(Date.now() - 900000),
      detectionCount: 2,
      signalStrength: 'strong'
    },
    {
      id: 'cam_006',
      name: 'Riverside Park Entrance',
      location: 'Recreation Area',
      status: 'offline',
      type: 'security',
      isFavorite: false,
      lastDetection: new Date(Date.now() - 3600000),
      detectionCount: 0,
      signalStrength: 'none'
    },
    {
      id: 'cam_007',
      name: 'Highway 101 Junction',
      location: 'Highway District',
      status: 'active',
      type: 'traffic',
      isFavorite: false,
      lastDetection: new Date(Date.now() - 450000),
      detectionCount: 5,
      signalStrength: 'strong'
    },
    {
      id: 'cam_008',
      name: 'Municipal Building Rear',
      location: 'Government District',
      status: 'active',
      type: 'security',
      isFavorite: false,
      lastDetection: null,
      detectionCount: 0,
      signalStrength: 'medium'
    }
  ];

  const filteredFeeds = cameraFeeds.filter(feed => {
    const matchesSearch = feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feed.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || feed.status === statusFilter;
    const matchesFavorites = !showFavorites || feed.isFavorite;
    
    return matchesSearch && matchesStatus && matchesFavorites;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return { icon: 'CheckCircle', color: 'text-green-500' };
      case 'maintenance':
        return { icon: 'AlertTriangle', color: 'text-yellow-500' };
      case 'offline':
        return { icon: 'XCircle', color: 'text-red-500' };
      default:
        return { icon: 'Circle', color: 'text-gray-500' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'traffic':
        return 'Car';
      case 'security':
        return 'Shield';
      case 'infrastructure':
        return 'Building';
      default:
        return 'Video';
    }
  };

  const getSignalBars = (strength) => {
    const bars = [];
    const levels = { none: 0, weak: 1, medium: 2, strong: 3 };
    const level = levels[strength] || 0;

    for (let i = 1; i <= 3; i++) {
      bars.push(
        <div
          key={i}
          className={`w-1 rounded-sm ${
            i <= level ? 'bg-green-500' : 'bg-gray-300'
          }`}
          style={{ height: `${i * 3 + 3}px` }}
        />
      );
    }
    return bars;
  };

  const formatLastDetection = (date) => {
    if (!date) return 'No detections';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-surface rounded-lg border border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary">Camera Directory</h3>
          <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search cameras..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-3"
        />

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setStatusFilter('active')}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'offline' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setStatusFilter('offline')}
            >
              Offline
            </Button>
          </div>
          <Button
            variant={showFavorites ? 'default' : 'ghost'}
            size="xs"
            iconName="Star"
            onClick={() => setShowFavorites(!showFavorites)}
          />
        </div>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredFeeds.map((feed) => {
            const statusInfo = getStatusIcon(feed.status);
            const isSelected = selectedFeeds.includes(feed.id);

            return (
              <div
                key={feed.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                  isSelected
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onClick={() => onFeedSelect(feed.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-2 flex-1">
                    <Icon 
                      name={getTypeIcon(feed.type)} 
                      size={16} 
                      className="text-text-secondary mt-0.5" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-text-primary truncate">
                        {feed.name}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">
                        {feed.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    {feed.isFavorite && (
                      <Icon name="Star" size={12} className="text-yellow-500 fill-current" />
                    )}
                    <Icon 
                      name={statusInfo.icon} 
                      size={12} 
                      className={statusInfo.color} 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Signal Strength */}
                    <div className="flex items-center space-x-1">
                      {getSignalBars(feed.signalStrength)}
                    </div>
                    
                    {/* Detection Count */}
                    {feed.detectionCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <Icon name="AlertTriangle" size={10} className="text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">
                          {feed.detectionCount}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-text-secondary">
                      {formatLastDetection(feed.lastDetection)}
                    </p>
                  </div>
                </div>

                {/* Toggle Button */}
                <div className="mt-2 pt-2 border-t border-border">
                  <Button
                    variant={isSelected ? 'destructive' : 'outline'}
                    size="xs"
                    fullWidth
                    iconName={isSelected ? 'EyeOff' : 'Eye'}
                    iconPosition="left"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFeedToggle(feed.id);
                    }}
                  >
                    {isSelected ? 'Remove from Grid' : 'Add to Grid'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredFeeds.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="Search" size={32} className="text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary">No cameras found</p>
            <p className="text-sm text-text-secondary mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {cameraFeeds.filter(f => f.status === 'active').length}
            </p>
            <p className="text-xs text-text-secondary">Active</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {cameraFeeds.filter(f => f.detectionCount > 0).length}
            </p>
            <p className="text-xs text-text-secondary">With Alerts</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {cameraFeeds.filter(f => f.status === 'offline').length}
            </p>
            <p className="text-xs text-text-secondary">Offline</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedDirectory;