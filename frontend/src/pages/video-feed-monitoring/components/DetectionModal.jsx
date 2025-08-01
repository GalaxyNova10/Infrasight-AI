import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DetectionModal = ({ detection, camera, isOpen, onClose, onCreateWorkOrder, onEscalate }) => {
  const [workOrderData, setWorkOrderData] = useState({
    priority: 'medium',
    department: '',
    assignee: '',
    description: '',
    estimatedHours: ''
  });

  if (!isOpen || !detection) return null;

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const departmentOptions = [
    { value: 'public_works', label: 'Public Works' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'traffic', label: 'Traffic Management' }
  ];

  const assigneeOptions = [
    { value: 'john_doe', label: 'John Doe - Senior Technician' },
    { value: 'jane_smith', label: 'Jane Smith - Maintenance Lead' },
    { value: 'mike_wilson', label: 'Mike Wilson - Field Supervisor' },
    { value: 'sarah_johnson', label: 'Sarah Johnson - Utilities Specialist' }
  ];

  const getDetectionIcon = (type) => {
    switch (type) {
      case 'pothole':
        return 'AlertTriangle';
      case 'garbage_overflow':
        return 'Trash2';
      case 'water_leak':
        return 'Droplets';
      case 'streetlight_fault':
        return 'Lightbulb';
      default:
        return 'AlertCircle';
    }
  };

  const getDetectionColor = (type) => {
    switch (type) {
      case 'pothole':
        return 'text-yellow-600 bg-yellow-100';
      case 'garbage_overflow':
        return 'text-red-600 bg-red-100';
      case 'water_leak':
        return 'text-blue-600 bg-blue-100';
      case 'streetlight_fault':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDetectionType = (type) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleCreateWorkOrder = () => {
    const workOrder = {
      id: `wo_${Date.now()}`,
      detectionId: detection.id,
      cameraId: camera.id,
      location: camera.location,
      type: detection.type,
      ...workOrderData,
      createdAt: new Date(),
      status: 'pending'
    };
    
    onCreateWorkOrder(workOrder);
    onClose();
  };

  const handleEscalate = () => {
    onEscalate({
      detectionId: detection.id,
      cameraId: camera.id,
      type: detection.type,
      location: camera.location,
      confidence: detection.confidence,
      timestamp: detection.timestamp
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
      <div className="bg-surface rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getDetectionColor(detection.type)}`}>
              <Icon name={getDetectionIcon(detection.type)} size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                {formatDetectionType(detection.type)} Detection
              </h2>
              <p className="text-sm text-text-secondary">{camera.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Detection Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary">Detection Information</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Type:</span>
                  <span className="text-text-primary font-medium">
                    {formatDetectionType(detection.type)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-secondary">Confidence:</span>
                  <span className="text-text-primary font-medium">
                    {Math.round(detection.confidence * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-secondary">Detected:</span>
                  <span className="text-text-primary font-medium">
                    {detection.timestamp.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-secondary">Camera:</span>
                  <span className="text-text-primary font-medium">{camera.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-secondary">Location:</span>
                  <span className="text-text-primary font-medium">{camera.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary">Video Preview</h3>
              
              {/* Video Thumbnail/Preview */}
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <Icon name="Play" size={32} className="text-white mx-auto mb-2" />
                  <p className="text-white text-sm">Click to play detection clip</p>
                </div>
                
                {/* Detection Bounding Box Overlay */}
                <div
                  className="absolute border-2 border-red-500 bg-red-500/20"
                  style={{
                    left: `${detection.bbox.x}%`,
                    top: `${detection.bbox.y}%`,
                    width: `${detection.bbox.width}%`,
                    height: `${detection.bbox.height}%`
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {Math.round(detection.confidence * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" fullWidth iconName="Download">
                  Download Clip
                </Button>
                <Button variant="outline" size="sm" fullWidth iconName="Share">
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary">AI Analysis</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">
                    {Math.round(detection.confidence * 100)}%
                  </p>
                  <p className="text-sm text-text-secondary">Confidence Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">
                    {detection.bbox.width * detection.bbox.height}
                  </p>
                  <p className="text-sm text-text-secondary">Coverage Area</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">Medium</p>
                  <p className="text-sm text-text-secondary">Severity Level</p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Work Order Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary">Create Work Order</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Priority Level"
                options={priorityOptions}
                value={workOrderData.priority}
                onChange={(value) => setWorkOrderData(prev => ({ ...prev, priority: value }))}
              />
              
              <Select
                label="Department"
                options={departmentOptions}
                value={workOrderData.department}
                onChange={(value) => setWorkOrderData(prev => ({ ...prev, department: value }))}
                placeholder="Select department"
              />
              
              <Select
                label="Assign To"
                options={assigneeOptions}
                value={workOrderData.assignee}
                onChange={(value) => setWorkOrderData(prev => ({ ...prev, assignee: value }))}
                placeholder="Select assignee"
              />
              
              <Input
                label="Estimated Hours"
                type="number"
                placeholder="Enter hours"
                value={workOrderData.estimatedHours}
                onChange={(e) => setWorkOrderData(prev => ({ ...prev, estimatedHours: e.target.value }))}
              />
            </div>
            
            <Input
              label="Description"
              type="text"
              placeholder="Additional details or instructions..."
              value={workOrderData.description}
              onChange={(e) => setWorkOrderData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" iconName="ArrowUp" iconPosition="left" onClick={handleEscalate}>
                Escalate
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" iconName="Archive">
                Mark as False Positive
              </Button>
              <Button 
                variant="default" 
                iconName="Plus" 
                iconPosition="left"
                onClick={handleCreateWorkOrder}
                disabled={!workOrderData.department}
              >
                Create Work Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionModal;