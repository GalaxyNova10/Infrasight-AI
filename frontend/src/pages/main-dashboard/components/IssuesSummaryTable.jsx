import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IssuesSummaryTable = () => {
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedIssues, setSelectedIssues] = useState([]);

  // Mock issues data
  const issues = [
    {
      id: 'ISS-001',
      type: 'pothole',
      title: 'Large Pothole on Anna Salai',
      location: 'Anna Salai, Chennai',
      severity: 'high',
      status: 'pending',
      department: 'Greater Chennai Corporation',
      reportedBy: 'AI Detection',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      assignedTo: { name: 'Rajesh Kumar', gender: 'male' },
      estimatedTime: '2 hours'
    },
    {
      id: 'ISS-002',
      type: 'waterlogging',
      title: 'Water Main Break',
      location: 'Adyar Bridge Road, Chennai',
      severity: 'critical',
      status: 'in_progress',
      department: 'GCC Water Department',
      reportedBy: 'AI Detection',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      assignedTo: { name: 'Emergency Team', gender: 'female' },
      estimatedTime: '4 hours'
    },
    {
      id: 'ISS-003',
      type: 'streetlight',
      title: 'Streetlight Outage',
      location: 'Santhome High Road, Chennai',
      severity: 'medium',
      status: 'assigned',
      department: 'GCC Electrical',
      reportedBy: 'Citizen Report',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      assignedTo: { name: 'Mohan Kumar', gender: 'male' },
      estimatedTime: '1 hour'
    },
    {
      id: 'ISS-004',
      type: 'garbage_overflow',
      title: 'Garbage Bin Overflow',
      location: 'Velachery Main Road, Chennai',
      severity: 'medium',
      status: 'resolved',
      department: 'GCC Sanitation',
      reportedBy: 'AI Detection',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      assignedTo: { name: 'Priya Sharma', gender: 'female' },
      estimatedTime: 'Completed'
    },
    {
      id: 'ISS-005',
      type: 'pothole',
      title: 'Road Surface Damage',
      location: 'OMR Sholinganallur, Chennai',
      severity: 'low',
      status: 'pending',
      department: 'Greater Chennai Corporation',
      reportedBy: 'Citizen Report',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      assignedTo: { name: 'Unassigned', gender: 'male' },
      estimatedTime: '3 hours'
    }
  ];

  const getIssueIcon = (type) => {
    const icons = {
      pothole: 'AlertTriangle',
      waterlogging: 'Droplets',
      streetlight: 'Lightbulb',
      garbage_overflow: 'Trash2'
    };
    return icons[type] || 'AlertCircle';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-amber-100 text-amber-800 border-amber-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[severity] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-amber-100 text-amber-800',
      resolved: 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.pending;
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

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSelectIssue = (issueId) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSelectAll = () => {
    setSelectedIssues(
      selectedIssues.length === issues.length ? [] : issues.map(issue => issue.id)
    );
  };

  const sortedIssues = [...issues].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'timestamp') {
      aValue = aValue.getTime();
      bValue = bValue.getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="bg-surface border border-border rounded-lg shadow-elevation-2">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Recent Issues</h3>
          <div className="flex items-center space-x-2">
            {selectedIssues.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">
                  {selectedIssues.length} selected
                </span>
                <Button variant="outline" size="sm" iconName="UserPlus">
                  Assign
                </Button>
                <Button variant="outline" size="sm" iconName="CheckCircle">
                  Update Status
                </Button>
              </div>
            )}
            <Button variant="outline" size="sm" iconName="Filter">
              Filter
            </Button>
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIssues.length === issues.length}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="p-3 text-left text-sm font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Issue ID</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Type</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Location</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('severity')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Severity</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('assignedTo')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Assigned To</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Reported</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedIssues.map((issue) => (
              <tr key={issue.id} className="hover:bg-muted transition-smooth">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIssues.includes(issue.id)}
                    onChange={() => handleSelectIssue(issue.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-3">
                  <span className="font-mono text-sm text-primary font-medium">
                    {issue.id}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name={getIssueIcon(issue.type)} size={16} className="text-text-secondary" />
                    <span className="text-sm text-text-primary capitalize">
                      {issue.type.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{issue.location}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                    {issue.severity}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full ${issue.assignedTo.gender === 'male' ? 'bg-blue-200' : 'bg-pink-200'} flex items-center justify-center`}>
                      <Icon name="User" size={16} />
                    </div>
                    <span className="text-sm text-text-primary">{issue.assignedTo.name}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm">
                    <div className="text-text-primary">{formatTimeAgo(issue.timestamp)}</div>
                    <div className="text-text-secondary text-xs">{issue.reportedBy}</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" title="View Details">
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" title="Edit">
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" title="More Actions">
                      <Icon name="MoreHorizontal" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            Showing {issues.length} of {issues.length} issues
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <span className="text-sm text-text-primary px-3 py-1 bg-surface border border-border rounded">
              1
            </span>
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuesSummaryTable;