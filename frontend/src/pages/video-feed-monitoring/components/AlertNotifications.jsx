import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertNotifications = ({ onCreateWorkOrder, onEscalate }) => {
  const [alerts, setAlerts] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  // Mock real-time alerts
  const mockAlerts = [
    {
      id: 'alert_001',
      type: 'pothole',
      severity: 'high',
      camera: 'cam_001',
      location: 'Main Street & Oak Ave',
      confidence: 0.87,
      timestamp: new Date(Date.now() - 120000),
      status: 'new',
      description: 'Large pothole detected in traffic lane',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 'alert_002',
      type: 'garbage_overflow',
      severity: 'medium',
      camera: 'cam_002',
      location: 'City Hall Plaza',
      confidence: 0.92,
      timestamp: new Date(Date.now() - 300000),
      status: 'acknowledged',
      description: 'Garbage bin overflow detected',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 'alert_003',
      type: 'water_leak',
      severity: 'high',
      camera: 'cam_003',
      location: 'Bridge Overpass #7',
      confidence: 0.78,
      timestamp: new Date(Date.now() - 600000),
      status: 'escalated',
      description: 'Water leak detected near infrastructure',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);

    // Simulate new alerts coming in
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert = {
          id: `alert_${Date.now()}`,
          type: ['pothole', 'garbage_overflow', 'water_leak', 'streetlight_fault'][Math.floor(Math.random() * 4)],
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          camera: `cam_00${Math.floor(Math.random() * 4) + 1}`,
          location: ['Main Street', 'City Plaza', 'Park Avenue', 'Bridge Road'][Math.floor(Math.random() * 4)],
          confidence: 0.6 + Math.random() * 0.4,
          timestamp: new Date(),
          status: 'new',
          description: 'AI detection alert',
          coordinates: { lat: 40.7128 + (Math.random() - 0.5) * 0.1, lng: -74.0060 + (Math.random() - 0.5) * 0.1 }
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only 10 most recent
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type) => {
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

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800';
      case 'escalated':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcknowledge = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged' }
        : alert
    ));
  };

  const handleDismiss = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const newAlertsCount = alerts.filter(alert => alert.status === 'new').length;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="default"
          onClick={() => setIsMinimized(false)}
          className="relative shadow-lg"
          iconName="Bell"
          iconPosition="left"
        >
          Alerts ({newAlertsCount})
          {newAlertsCount > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {newAlertsCount}
            </div>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-surface border border-border rounded-lg shadow-elevation-3 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={18} className="text-primary" />
          <h3 className="font-semibold text-text-primary">Live Alerts</h3>
          {newAlertsCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {newAlertsCount} new
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            iconName="Minimize2"
            onClick={() => setIsMinimized(true)}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
          />
        </div>
      </div>

      {/* Alerts List */}
      <div className="max-h-80 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CheckCircle" size={32} className="text-green-500 mx-auto mb-3" />
            <p className="text-text-secondary">No active alerts</p>
            <p className="text-sm text-text-secondary mt-1">All systems operating normally</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.severity)} transition-all hover:shadow-sm`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-2">
                    <Icon 
                      name={getAlertIcon(alert.type)} 
                      size={16} 
                      className="text-text-primary mt-0.5" 
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-text-primary">
                        {alert.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Detected
                      </h4>
                      <p className="text-xs text-text-secondary">{alert.location}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(alert.status)}`}>
                    {alert.status}
                  </span>
                </div>

                <p className="text-sm text-text-secondary mb-2">{alert.description}</p>

                <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                  <span>Confidence: {Math.round(alert.confidence * 100)}%</span>
                  <span>{formatTimeAgo(alert.timestamp)}</span>
                </div>

                {alert.status === 'new' && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="Check"
                      iconPosition="left"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      Acknowledge
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="ArrowUp"
                      iconPosition="left"
                      onClick={() => onEscalate(alert)}
                    >
                      Escalate
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => onCreateWorkOrder(alert)}
                    >
                      Work Order
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="X"
                      onClick={() => handleDismiss(alert.id)}
                    />
                  </div>
                )}

                {alert.status === 'acknowledged' && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => onCreateWorkOrder(alert)}
                    >
                      Create Work Order
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="ArrowUp"
                      iconPosition="left"
                      onClick={() => onEscalate(alert)}
                    >
                      Escalate
                    </Button>
                  </div>
                )}

                {alert.status === 'escalated' && (
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={12} className="text-purple-600" />
                    <span className="text-xs text-purple-600">Escalated to supervisor</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              {alerts.length} total alert{alerts.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="xs" iconName="Archive">
                Clear All
              </Button>
              <Button variant="ghost" size="xs" iconName="ExternalLink">
                View All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertNotifications;