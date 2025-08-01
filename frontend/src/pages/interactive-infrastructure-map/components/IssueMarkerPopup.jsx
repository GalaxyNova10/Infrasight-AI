import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const IssueMarkerPopup = ({ issue, onClose, onAssign, onUpdateStatus, onViewDetails }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported': return 'text-blue-600 bg-blue-50';
      case 'assigned': return 'text-purple-600 bg-purple-50';
      case 'in-progress': return 'text-orange-600 bg-orange-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'potholes': return 'AlertTriangle';
      case 'leaks': return 'Droplets';
      case 'lighting': return 'Lightbulb';
      case 'waste': return 'Trash2';
      default: return 'AlertCircle';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-elevation-3 w-80 max-w-sm">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name={getTypeIcon(issue.type)} size={16} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{issue.title}</h3>
              <p className="text-sm text-text-secondary">ID: {issue.id}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <Icon name="X" size={14} />
          </Button>
        </div>
      </div>

      {/* Image */}
      {issue.image && (
        <div className="p-4 pb-0">
          <div className="w-full h-32 overflow-hidden rounded-lg">
            <Image
              src={issue.image}
              alt={issue.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Status and Severity */}
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
            {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
            {issue.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary line-clamp-2">
          {issue.description}
        </p>

        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="MapPin" size={14} />
          <span>{issue.location}</span>
        </div>

        {/* Reported Info */}
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>Reported {formatDate(issue.reportedAt)}</span>
          </div>
          {issue.reportedBy && (
            <div className="flex items-center space-x-1">
              <Icon name="User" size={12} />
              <span>{issue.reportedBy}</span>
            </div>
          )}
        </div>

        {/* Assignment Info */}
        {issue.assignedTo && (
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="UserCheck" size={14} className="text-text-secondary" />
            <span className="text-text-secondary">Assigned to:</span>
            <span className="font-medium text-text-primary">{issue.assignedTo}</span>
          </div>
        )}

        {/* Priority Score */}
        {issue.priorityScore && (
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="TrendingUp" size={14} className="text-text-secondary" />
            <span className="text-text-secondary">Priority Score:</span>
            <span className="font-medium text-text-primary">{issue.priorityScore}/100</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="UserPlus"
            iconPosition="left"
            onClick={() => onAssign(issue.id)}
          >
            Assign
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={() => onUpdateStatus(issue.id)}
          >
            Update
          </Button>
        </div>
        <Button
          variant="default"
          size="sm"
          fullWidth
          iconName="Eye"
          iconPosition="left"
          onClick={() => onViewDetails(issue.id)}
        >
          View Full Details
        </Button>
      </div>
    </div>
  );
};

export default IssueMarkerPopup;