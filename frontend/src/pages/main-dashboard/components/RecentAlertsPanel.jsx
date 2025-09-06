import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentAlertsPanel = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Water Main Break Detected',
      description: 'AI system detected potential water main break on Anna Salai. Immediate attention required.',
      location: 'Anna Salai, Chennai',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      source: 'AI Detection',
      department: 'Water & Sewer',
      status: 'unread',
      priority: 'critical'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Multiple Potholes Detected',
      description: 'Camera system identified 3 new potholes on OMR requiring repair.',
      location: 'OMR, Chennai',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      source: 'AI Detection',
      department: 'Public Works',
      status: 'read',
      priority: 'high'
    },
    {
      id: 3,
      type: 'info',
      title: 'Streetlight Outage Reported',
      description: 'Citizen reported streetlight outage. AI verification pending.',
      location: 'T. Nagar, Chennai',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      source: 'Citizen Report',
      department: 'Electrical',
      status: 'read',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'success',
      title: 'Issue Resolved',
      description: 'Garbage overflow in Mylapore has been cleared by maintenance crew.',
      location: 'Mylapore, Chennai',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      source: 'Field Update',
      department: 'Sanitation',
      status: 'read',
      priority: 'resolved'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Traffic Signal Malfunction',
      description: 'AI detected irregular traffic signal patterns at intersection in Adyar.',
      location: 'Adyar, Chennai',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      source: 'AI Detection',
      department: 'Traffic',
      status: 'unread',
      priority: 'high'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getAlertIcon = (type) => {
    const icons = {
      critical: 'AlertTriangle',
      warning: 'AlertCircle',
      info: 'Info',
      success: 'CheckCircle'
    };
    return icons[type] || 'Bell';
  };

  const getAlertColor = (type) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 border-red-200',
      warning: 'text-amber-600 bg-amber-50 border-amber-200',
      info: 'text-blue-600 bg-blue-50 border-blue-200',
      success: 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[type] || colors.info;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-amber-500',
      medium: 'bg-blue-500',
      low: 'bg-green-500',
      resolved: 'bg-gray-400'
    };
    return colors[priority] || colors.medium;
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

  const markAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'read' } : alert
    ));
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.status === filter);

  const unreadCount = alerts.filter(alert => alert.status === 'unread').length;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-elevation-2">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-text-primary">Recent Alerts</h3>
            {unreadCount > 0 && (
              <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" iconName="Settings">
            Settings
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All', count: alerts.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: alerts.length - unreadCount }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-smooth ${
                filter === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary">No alerts to display</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 hover:bg-muted transition-smooth cursor-pointer ${
                  alert.status === 'unread' ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(alert.id)}
              >
                <div className="flex items-start space-x-3">
                  {/* Alert Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getAlertColor(alert.type)}`}>
                    <Icon name={getAlertIcon(alert.type)} size={18} />
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium text-sm ${
                        alert.status === 'unread' ? 'text-text-primary' : 'text-text-secondary'
                      }`}>
                        {alert.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${getPriorityColor(alert.priority)}`}
                          title={`${alert.priority} priority`}
                        />
                        <span className="text-xs text-text-secondary">
                          {formatTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                      {alert.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Icon name="MapPin" size={12} />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Building" size={12} />
                          <span>{alert.department}</span>
                        </div>
                      </div>
                      <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                        {alert.source}
                      </span>
                    </div>
                  </div>

                  {/* Unread Indicator */}
                  {alert.status === 'unread' && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <Button variant="ghost" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentAlertsPanel;