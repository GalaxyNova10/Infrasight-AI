import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ControlPanel = ({ 
  gridLayout, 
  onGridLayoutChange, 
  detectionSensitivity, 
  onSensitivityChange,
  selectedFeeds,
  onPlaybackControl 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(75);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const gridLayoutOptions = [
    { value: '1x1', label: '1×1 Single View' },
    { value: '2x2', label: '2×2 Quad View' },
    { value: '3x3', label: '3×3 Multi View' }
  ];

  const sensitivityOptions = [
    { value: 'low', label: 'Low Sensitivity' },
    { value: 'medium', label: 'Medium Sensitivity' },
    { value: 'high', label: 'High Sensitivity' },
    { value: 'custom', label: 'Custom Settings' }
  ];

  const playbackSpeedOptions = [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x Normal' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' }
  ];

  const handleRecordingToggle = () => {
    setIsRecording(!isRecording);
    // In real app, this would trigger recording functionality
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  return (
    <div className="bg-surface rounded-lg border border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Control Panel</h3>
          <Button variant="outline" size="sm" iconName="Settings" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Grid Layout Control */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center">
            <Icon name="Grid3X3" size={16} className="mr-2" />
            Grid Layout
          </h4>
          <Select
            options={gridLayoutOptions}
            value={gridLayout}
            onChange={onGridLayoutChange}
            placeholder="Select layout"
          />
          <div className="grid grid-cols-3 gap-2">
            {gridLayoutOptions.map((option) => (
              <Button
                key={option.value}
                variant={gridLayout === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onGridLayoutChange(option.value)}
                className="text-xs"
              >
                {option.value}
              </Button>
            ))}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center">
            <Icon name="Play" size={16} className="mr-2" />
            Playback Controls
          </h4>
          <div className="flex items-center justify-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              iconName="SkipBack"
              onClick={() => onPlaybackControl('previous')}
            />
            <Button 
              variant="outline" 
              size="sm" 
              iconName="Rewind"
              onClick={() => onPlaybackControl('rewind')}
            />
            <Button 
              variant="default" 
              size="sm" 
              iconName="Play"
              onClick={() => onPlaybackControl('play')}
            />
            <Button 
              variant="outline" 
              size="sm" 
              iconName="FastForward"
              onClick={() => onPlaybackControl('forward')}
            />
            <Button 
              variant="outline" 
              size="sm" 
              iconName="SkipForward"
              onClick={() => onPlaybackControl('next')}
            />
          </div>
          
          <Select
            label="Playback Speed"
            options={playbackSpeedOptions}
            value={playbackSpeed}
            onChange={setPlaybackSpeed}
          />
        </div>

        {/* Recording Controls */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center">
            <Icon name="Video" size={16} className="mr-2" />
            Recording
          </h4>
          <div className="space-y-2">
            <Button
              variant={isRecording ? 'destructive' : 'default'}
              fullWidth
              iconName={isRecording ? 'Square' : 'Circle'}
              iconPosition="left"
              onClick={handleRecordingToggle}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            {isRecording && (
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>Recording active feeds</span>
              </div>
            )}
          </div>
        </div>

        {/* Audio Controls */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center">
            <Icon name="Volume2" size={16} className="mr-2" />
            Audio
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="VolumeX" size={14} className="text-text-secondary" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <Icon name="Volume2" size={14} className="text-text-secondary" />
            </div>
            <div className="text-center text-sm text-text-secondary">
              Volume: {volume}%
            </div>
          </div>
        </div>

        {/* AI Detection Settings */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center">
            <Icon name="Brain" size={16} className="mr-2" />
            AI Detection
          </h4>
          <Select
            label="Sensitivity Level"
            options={sensitivityOptions}
            value={detectionSensitivity}
            onChange={onSensitivityChange}
          />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Detection Types</span>
              <Button variant="ghost" size="xs" iconName="Settings" />
            </div>
            <div className="space-y-1">
              {[
                { type: 'pothole', label: 'Potholes', enabled: true },
                { type: 'garbage', label: 'Garbage Overflow', enabled: true },
                { type: 'leak', label: 'Water Leaks', enabled: false },
                { type: 'streetlight', label: 'Streetlight Faults', enabled: true }
              ].map((detection) => (
                <div key={detection.type} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{detection.label}</span>
                  <div className={`w-8 h-4 rounded-full ${
                    detection.enabled ? 'bg-primary' : 'bg-gray-300'
                  } relative cursor-pointer`}>
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                      detection.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center">
            <Icon name="Zap" size={16} className="mr-2" />
            Quick Actions
          </h4>
          <div className="space-y-2">
            <Button variant="outline" size="sm" fullWidth iconName="Camera" iconPosition="left">
              Take Screenshot
            </Button>
            <Button variant="outline" size="sm" fullWidth iconName="Download" iconPosition="left">
              Export Footage
            </Button>
            <Button variant="outline" size="sm" fullWidth iconName="Share" iconPosition="left">
              Share View
            </Button>
            <Button variant="outline" size="sm" fullWidth iconName="AlertTriangle" iconPosition="left">
              Create Alert
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center">
            <Icon name="Activity" size={16} className="mr-2" />
            System Status
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">CPU Usage</span>
              <span className="text-text-primary">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Memory</span>
              <span className="text-text-primary">2.1GB / 8GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Network</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-text-primary">Stable</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Storage</span>
              <span className="text-text-primary">156GB free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-center">
          <p className="text-xs text-text-secondary">
            {selectedFeeds.length} feed{selectedFeeds.length !== 1 ? 's' : ''} active
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;