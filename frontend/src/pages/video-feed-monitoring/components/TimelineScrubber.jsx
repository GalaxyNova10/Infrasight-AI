import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimelineScrubber = ({ onTimeChange, onDetectionSelect }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRange, setTimeRange] = useState(60); // minutes
  const [isDragging, setIsDragging] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(100); // percentage from right (current time)
  const timelineRef = useRef(null);

  // Mock detection events for timeline
  const detectionEvents = [
    {
      id: 'det_001',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      type: 'pothole',
      camera: 'cam_001',
      confidence: 0.87,
      severity: 'medium'
    },
    {
      id: 'det_002',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      type: 'garbage_overflow',
      camera: 'cam_002',
      confidence: 0.92,
      severity: 'high'
    },
    {
      id: 'det_003',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      type: 'water_leak',
      camera: 'cam_003',
      confidence: 0.78,
      severity: 'low'
    },
    {
      id: 'det_004',
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      type: 'streetlight_fault',
      camera: 'cam_001',
      confidence: 0.85,
      severity: 'medium'
    },
    {
      id: 'det_005',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      type: 'pothole',
      camera: 'cam_004',
      confidence: 0.91,
      severity: 'high'
    }
  ];

  const timeRangeOptions = [
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 60, label: '1 hour' },
    { value: 180, label: '3 hours' },
    { value: 360, label: '6 hours' },
    { value: 720, label: '12 hours' }
  ];

  const getDetectionColor = (type) => {
    switch (type) {
      case 'pothole':
        return 'bg-yellow-500';
      case 'garbage_overflow':
        return 'bg-red-500';
      case 'water_leak':
        return 'bg-blue-500';
      case 'streetlight_fault':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityHeight = (severity) => {
    switch (severity) {
      case 'high':
        return 'h-6';
      case 'medium':
        return 'h-4';
      case 'low':
        return 'h-3';
      default:
        return 'h-3';
    }
  };

  const calculateEventPosition = (timestamp) => {
    const now = new Date();
    const rangeMs = timeRange * 60 * 1000;
    const eventAge = now - timestamp;
    const position = Math.max(0, Math.min(100, (eventAge / rangeMs) * 100));
    return 100 - position; // Flip so recent events are on the right
  };

  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    setPlaybackPosition(percentage);
    
    // Calculate the time based on position
    const rangeMs = timeRange * 60 * 1000;
    const timeOffset = ((100 - percentage) / 100) * rangeMs;
    const targetTime = new Date(Date.now() - timeOffset);
    
    setCurrentTime(targetTime);
    onTimeChange(targetTime);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleTimelineClick(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleTimelineClick(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatTimeLabel = (minutesAgo) => {
    if (minutesAgo === 0) return 'Now';
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    const hours = Math.floor(minutesAgo / 60);
    const mins = minutesAgo % 60;
    return mins > 0 ? `${hours}h ${mins}m ago` : `${hours}h ago`;
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Clock" size={20} className="text-primary" />
          <h3 className="font-semibold text-text-primary">Timeline & Playback</h3>
          <span className="text-sm text-text-secondary">
            {formatTime(currentTime)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1">
            {timeRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? 'default' : 'outline'}
                size="xs"
                onClick={() => setTimeRange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" iconName="RotateCcw" iconPosition="left">
            Reset
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4">
        <div className="relative">
          {/* Time Labels */}
          <div className="flex justify-between text-xs text-text-secondary mb-2">
            <span>{formatTimeLabel(timeRange)}</span>
            <span>{formatTimeLabel(Math.floor(timeRange * 0.75))}</span>
            <span>{formatTimeLabel(Math.floor(timeRange * 0.5))}</span>
            <span>{formatTimeLabel(Math.floor(timeRange * 0.25))}</span>
            <span>Now</span>
          </div>

          {/* Timeline Track */}
          <div
            ref={timelineRef}
            className="relative h-12 bg-muted rounded-lg cursor-pointer select-none"
            onMouseDown={handleMouseDown}
          >
            {/* Grid Lines */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-border last:border-r-0"
                />
              ))}
            </div>

            {/* Detection Events */}
            {detectionEvents
              .filter(event => {
                const eventAge = (new Date() - event.timestamp) / (1000 * 60);
                return eventAge <= timeRange;
              })
              .map((event) => {
                const position = calculateEventPosition(event.timestamp);
                return (
                  <div
                    key={event.id}
                    className={`absolute bottom-1 w-2 ${getDetectionColor(event.type)} ${getSeverityHeight(event.severity)} rounded-t cursor-pointer hover:opacity-80 transition-opacity`}
                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDetectionSelect(event);
                    }}
                    title={`${event.type.replace('_', ' ')} - ${event.confidence * 100}% confidence`}
                  />
                );
              })}

            {/* Playback Position Indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
              style={{ left: `${playbackPosition}%` }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm" />
            </div>

            {/* Current Time Indicator */}
            <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-green-500">
              <div className="absolute -top-1 right-0 transform translate-x-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>

          {/* Detection Legend */}
          <div className="flex items-center justify-center space-x-4 mt-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded" />
              <span className="text-text-secondary">Potholes</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-text-secondary">Garbage</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-text-secondary">Water Leaks</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded" />
              <span className="text-text-secondary">Streetlights</span>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" iconName="SkipBack" />
          <Button variant="outline" size="sm" iconName="Rewind" />
          <Button variant="default" size="sm" iconName="Play" />
          <Button variant="outline" size="sm" iconName="FastForward" />
          <Button variant="outline" size="sm" iconName="SkipForward" />
          
          <div className="mx-4 h-6 w-px bg-border" />
          
          <Button variant="outline" size="sm" iconName="Calendar">
            Jump to Date
          </Button>
          <Button variant="outline" size="sm" iconName="Download">
            Export Timeline
          </Button>
        </div>
      </div>

      {/* Detection Summary */}
      <div className="px-4 pb-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary">
                  {detectionEvents.length}
                </p>
                <p className="text-xs text-text-secondary">Total Events</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary">
                  {detectionEvents.filter(e => e.severity === 'high').length}
                </p>
                <p className="text-xs text-text-secondary">High Priority</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary">
                  {new Set(detectionEvents.map(e => e.camera)).size}
                </p>
                <p className="text-xs text-text-secondary">Cameras</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" iconName="BarChart3" iconPosition="left">
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineScrubber;