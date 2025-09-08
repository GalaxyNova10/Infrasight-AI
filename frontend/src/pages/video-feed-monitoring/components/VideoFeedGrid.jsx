import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoFeedGrid = ({
  selectedFeeds,
  gridLayout,
  onFeedSelect,
  onDetectionClick,
  detectionSensitivity,
  onNewDetection // New prop for alerts
}) => {
  const [feedStatuses, setFeedStatuses] = useState({});
  const [liveDetections, setLiveDetections] = useState({});
  const videoRefs = useRef({});
  const canvasRefs = useRef({});

  const mockFeeds = [
    {
      id: 'cam_001',
      name: 'Main Street & Oak Ave',
      location: 'Downtown District',
      status: 'active',
      recording: true,
      videoUrl: 'http://localhost:8000/videos/street.mp4',
    },
    {
      id: 'cam_002',
      name: 'City Hall Plaza',
      location: 'Government District',
      status: 'active',
      recording: true,
      videoUrl: 'http://localhost:8000/videos/street.mp4',
    },
    {
      id: 'cam_003',
      name: 'Bridge Overpass #7',
      location: 'Industrial Zone',
      status: 'active',
      recording: false,
      videoUrl: 'http://localhost:8000/videos/street.mp4',
    },
    {
      id: 'cam_004',
      name: 'Park Avenue & 5th St',
      location: 'Residential Area',
      status: 'maintenance',
      recording: false,
      videoUrl: 'http://localhost:8000/videos/street.mp4',
    }
  ];

  useEffect(() => {
    Object.values(canvasRefs.current).forEach(canvas => {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    for (const feedId in liveDetections) {
      const detections = liveDetections[feedId];
      const canvas = canvasRefs.current[feedId];
      if (canvas && detections) {
        const video = videoRefs.current[feedId];
        const scaleX = canvas.width / video.videoWidth;
        const scaleY = canvas.height / video.videoHeight;

        const ctx = canvas.getContext('2d');
        detections.forEach(detection => {
          const { x_min, y_min, x_max, y_max } = detection.bounding_box;
          const color = DETECTION_COLORS[detection.class_name] || DETECTION_COLORS.default; // Use DETECTION_COLORS
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.strokeRect(x_min * scaleX, y_min * scaleY, (x_max - x_min) * scaleX, (y_max - y_min) * scaleY);
          ctx.fillStyle = color;
          ctx.font = '12px Arial';
          ctx.fillText(`${detection.class_name} (${detection.confidence_score.toFixed(2)})`, x_min * scaleX, y_min * scaleY - 5);
        });
      }
    }
  }, [liveDetections]);

  // Periodic scanning for real-time detections
  useEffect(() => {
    const scanIntervals = {};

    selectedFeeds.forEach(feedId => {
      // Clear any existing interval for this feed to prevent duplicates
      if (scanIntervals[feedId]) {
        clearInterval(scanIntervals[feedId]);
      }
      // Start a new interval for each selected feed
      scanIntervals[feedId] = setInterval(() => handleScanFrame(feedId), 2000); // Scan every 2 seconds
    });

    // Cleanup intervals when component unmounts or selectedFeeds change
    return () => {
      for (const feedId in scanIntervals) {
        clearInterval(scanIntervals[feedId]);
      }
    };
  }, [selectedFeeds, detectionSensitivity]); // Re-run effect when selectedFeeds or detectionSensitivity change

  const handleScanFrame = async (feedId) => {
    const video = videoRefs.current[feedId];
    if (!video || video.paused || video.ended) return; // Only scan if video is playing

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      try {
        const response = await fetch(import.meta.env.VITE_CV_PROCESSOR_URL, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setLiveDetections(prev => ({ ...prev, [feedId]: data.detections })); // Changed from data.predictions to data.detections

          // Check for high-confidence detections and trigger alert
          const sensitivityThresholds = {
            'low': 0.7,
            'medium': 0.8,
            'high': 0.9
          };
          const threshold = sensitivityThresholds[detectionSensitivity] || 0.8;

          data.detections.forEach(detection => {
            if (detection.confidence_score >= threshold) {
              onNewDetection({
                feedId: feedId,
                detection: detection,
                timestamp: new Date().toISOString()
              });
            }
          });

        } else {
          console.error('Failed to get predictions', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error predicting frame:', error);
      }
    }, 'image/jpeg');
  };

  const getGridClass = () => {
    switch (gridLayout) {
      case '2x2': return 'grid-cols-2 grid-rows-2';
      case '3x3': return 'grid-cols-3 grid-rows-3';
      case '1x1': return 'grid-cols-1 grid-rows-1';
      default: return 'grid-cols-2 grid-rows-2';
    }
  };

  const DETECTION_COLORS = {
    'pothole': 'yellow',
    'garbage_overflow': 'red',
    'water_leak': 'blue',
    'streetlight_fault': 'purple', // Using a standard purple for now
    'default': 'gray',
  };

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
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
              <video
                ref={el => videoRefs.current[feed.id] = el}
                src={feed.videoUrl}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <canvas
                ref={el => canvasRefs.current[feed.id] = el}
                className="absolute top-0 left-0 w-full h-full"
                width={videoRefs.current[feed.id]?.clientWidth}
                height={videoRefs.current[feed.id]?.clientHeight}
                onClick={(e) => {
                  const canvas = canvasRefs.current[feed.id];
                  const rect = canvas.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const detections = liveDetections[feed.id];
                  if (detections) {
                    const clickedDetection = detections.find(d => {
                      const { x_min, y_min, x_max, y_max } = d.bounding_box;
                      return x >= x_min && x <= x_max && y >= y_min && y <= y_max;
                    });
                    if (clickedDetection) {
                      e.stopPropagation();
                      onDetectionClick(clickedDetection, feed);
                    }
                  }
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                {/* Removed Scan Frame Button */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoFeedGrid;
