import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import VideoFeedGrid from './components/VideoFeedGrid';
import FeedDirectory from './components/FeedDirectory';
import ControlPanel from './components/ControlPanel';
import TimelineScrubber from './components/TimelineScrubber';
import AlertNotifications from './components/AlertNotifications';
import DetectionModal from './components/DetectionModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const VideoFeedMonitoring = () => {
  const [selectedFeeds, setSelectedFeeds] = useState(['cam_001', 'cam_002', 'cam_003', 'cam_004']);
  const [gridLayout, setGridLayout] = useState('2x2');
  const [detectionSensitivity, setDetectionSensitivity] = useState('medium');
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isDetectionModalOpen, setIsDetectionModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFeedToggle = (feedId) => {
    setSelectedFeeds(prev => {
      if (prev.includes(feedId)) {
        return prev.filter(id => id !== feedId);
      } else {
        const maxFeeds = gridLayout === '3x3' ? 9 : 4;
        if (prev.length < maxFeeds) {
          return [...prev, feedId];
        }
        return prev;
      }
    });
  };

  const handleFeedSelect = (feedId) => {
    // Focus on selected feed or switch to single view
    if (gridLayout !== '1x1') {
      setGridLayout('1x1');
      setSelectedFeeds([feedId]);
    }
  };

  const handleDetectionClick = (detection, camera) => {
    setSelectedDetection(detection);
    setSelectedCamera(camera);
    setIsDetectionModalOpen(true);
  };

  const handleTimeChange = (newTime) => {
    setCurrentTime(newTime);
    // In real app, this would update video feeds to show historical footage
  };

  const handleDetectionSelect = (detection) => {
    // Jump to detection time and highlight in video
    setCurrentTime(detection.timestamp);
    // Additional logic to highlight detection in video feed
  };

  const handlePlaybackControl = (action) => {
    switch (action) {
      case 'play':
        // Toggle play/pause
        break;
      case 'previous':
        // Go to previous detection
        break;
      case 'next':
        // Go to next detection
        break;
      case 'rewind':
        // Rewind 10 seconds
        setCurrentTime(new Date(currentTime.getTime() - 10000));
        break;
      case 'forward':
        // Forward 10 seconds
        setCurrentTime(new Date(currentTime.getTime() + 10000));
        break;
      default:
        break;
    }
  };

  const handleCreateWorkOrder = (workOrderData) => {
    // In real app, this would create a work order in the system
    console.log('Creating work order:', workOrderData);
    // Show success notification
  };

  const handleEscalate = (escalationData) => {
    // In real app, this would escalate the issue to supervisors
    console.log('Escalating issue:', escalationData);
    // Show success notification
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-full mx-auto p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Chennai Video Feed Monitoring</h1>
              <p className="text-text-secondary mt-1">
                Monitor live camera feeds and AI detection results for Greater Chennai Corporation infrastructure
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <Button
                variant="outline"
                iconName={isFullscreen ? "Minimize2" : "Maximize2"}
                iconPosition="left"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
              <Button variant="outline" iconName="Settings" iconPosition="left">
                Configure
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Left Sidebar - Feed Directory */}
            <div className="col-span-12 lg:col-span-3">
              <FeedDirectory
                onFeedToggle={handleFeedToggle}
                selectedFeeds={selectedFeeds}
                onFeedSelect={handleFeedSelect}
              />
            </div>

            {/* Center - Video Grid */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <VideoFeedGrid
                selectedFeeds={selectedFeeds}
                gridLayout={gridLayout}
                onFeedSelect={handleFeedSelect}
                onDetectionClick={handleDetectionClick}
                detectionSensitivity={detectionSensitivity}
              />
              
              <TimelineScrubber
                onTimeChange={handleTimeChange}
                onDetectionSelect={handleDetectionSelect}
              />
            </div>

            {/* Right Sidebar - Control Panel */}
            <div className="col-span-12 lg:col-span-3">
              <ControlPanel
                gridLayout={gridLayout}
                onGridLayoutChange={setGridLayout}
                detectionSensitivity={detectionSensitivity}
                onSensitivityChange={setDetectionSensitivity}
                selectedFeeds={selectedFeeds}
                onPlaybackControl={handlePlaybackControl}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Alert Notifications Overlay */}
      <AlertNotifications
        onCreateWorkOrder={handleCreateWorkOrder}
        onEscalate={handleEscalate}
      />

      {/* Detection Detail Modal */}
      <DetectionModal
        detection={selectedDetection}
        camera={selectedCamera}
        isOpen={isDetectionModalOpen}
        onClose={() => setIsDetectionModalOpen(false)}
        onCreateWorkOrder={handleCreateWorkOrder}
        onEscalate={handleEscalate}
      />
    </div>
  );
};

export default VideoFeedMonitoring;