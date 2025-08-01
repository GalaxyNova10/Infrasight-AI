import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const MapSidebar = ({ 
  filters, 
  onFiltersChange, 
  isCollapsed, 
  onToggleCollapse,
  onExportData,
  onBulkOperations 
}) => {
  const [searchAddress, setSearchAddress] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '2025-01-01',
    end: '2025-07-29'
  });

  const issueTypes = [
    { id: 'potholes', label: 'Potholes', color: 'bg-red-500', count: 127 },
    { id: 'leaks', label: 'Water Leaks', color: 'bg-blue-500', count: 43 },
    { id: 'lighting', label: 'Street Lighting', color: 'bg-yellow-500', count: 89 },
    { id: 'waste', label: 'Waste Management', color: 'bg-green-500', count: 56 }
  ];

  const departments = [
    { id: 'public-works', label: 'Public Works', count: 156 },
    { id: 'utilities', label: 'Utilities', count: 87 },
    { id: 'sanitation', label: 'Sanitation', count: 72 }
  ];

  const severityLevels = [
    { id: 'critical', label: 'Critical', color: 'bg-red-600', count: 23 },
    { id: 'high', label: 'High', color: 'bg-orange-500', count: 67 },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500', count: 134 },
    { id: 'low', label: 'Low', color: 'bg-green-500', count: 91 }
  ];

  const statusOptions = [
    { id: 'reported', label: 'Reported', count: 89 },
    { id: 'assigned', label: 'Assigned', count: 156 },
    { id: 'in-progress', label: 'In Progress', count: 67 },
    { id: 'resolved', label: 'Resolved', count: 203 }
  ];

  const handleIssueTypeChange = (typeId, checked) => {
    const updatedTypes = checked 
      ? [...filters.issueTypes, typeId]
      : filters.issueTypes.filter(id => id !== typeId);
    
    onFiltersChange({
      ...filters,
      issueTypes: updatedTypes
    });
  };

  const handleDepartmentChange = (deptId, checked) => {
    const updatedDepts = checked 
      ? [...filters.departments, deptId]
      : filters.departments.filter(id => id !== deptId);
    
    onFiltersChange({
      ...filters,
      departments: updatedDepts
    });
  };

  const handleSeverityChange = (severityId, checked) => {
    const updatedSeverity = checked 
      ? [...filters.severity, severityId]
      : filters.severity.filter(id => id !== severityId);
    
    onFiltersChange({
      ...filters,
      severity: updatedSeverity
    });
  };

  const handleStatusChange = (statusId, checked) => {
    const updatedStatus = checked 
      ? [...filters.status, statusId]
      : filters.status.filter(id => id !== statusId);
    
    onFiltersChange({
      ...filters,
      status: updatedStatus
    });
  };

  const handleDateRangeChange = (field, value) => {
    const updatedRange = { ...dateRange, [field]: value };
    setDateRange(updatedRange);
    onFiltersChange({
      ...filters,
      dateRange: updatedRange
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      issueTypes: [],
      departments: [],
      severity: [],
      status: [],
      dateRange: { start: '', end: '' }
    });
    setDateRange({ start: '', end: '' });
    setSearchAddress('');
  };

  const handleAddressSearch = (e) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      // Simulate address search
      console.log('Searching for address:', searchAddress);
    }
  };

  if (isCollapsed) {
    return (
      <div className="fixed left-4 top-20 z-1000 bg-surface border border-border rounded-lg shadow-elevation-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="m-2"
        >
          <Icon name="ChevronRight" size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-16 bottom-0 w-80 bg-surface border-r border-border z-1000 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Map Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          {filters.issueTypes.length + filters.departments.length + filters.severity.length + filters.status.length} filters active
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Address Search */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Search Location</h3>
          <form onSubmit={handleAddressSearch} className="space-y-2">
            <Input
              type="text"
              placeholder="Enter address or landmark"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
            <Button type="submit" size="sm" fullWidth iconName="Search" iconPosition="left">
              Search
            </Button>
          </form>
        </div>

        {/* Issue Types */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Issue Types</h3>
          <div className="space-y-2">
            {issueTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between">
                <Checkbox
                  label={
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${type.color}`} />
                      <span>{type.label}</span>
                    </div>
                  }
                  checked={filters.issueTypes.includes(type.id)}
                  onChange={(e) => handleIssueTypeChange(type.id, e.target.checked)}
                />
                <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                  {type.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Levels */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Severity</h3>
          <div className="space-y-2">
            {severityLevels.map((level) => (
              <div key={level.id} className="flex items-center justify-between">
                <Checkbox
                  label={
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${level.color}`} />
                      <span className="capitalize">{level.label}</span>
                    </div>
                  }
                  checked={filters.severity.includes(level.id)}
                  onChange={(e) => handleSeverityChange(level.id, e.target.checked)}
                />
                <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                  {level.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Departments</h3>
          <div className="space-y-2">
            {departments.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between">
                <Checkbox
                  label={dept.label}
                  checked={filters.departments.includes(dept.id)}
                  onChange={(e) => handleDepartmentChange(dept.id, e.target.checked)}
                />
                <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                  {dept.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Status</h3>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <div key={status.id} className="flex items-center justify-between">
                <Checkbox
                  label={status.label}
                  checked={filters.status.includes(status.id)}
                  onChange={(e) => handleStatusChange(status.id, e.target.checked)}
                />
                <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                  {status.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Date Range</h3>
          <div className="space-y-3">
            <Input
              type="date"
              label="From"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
            />
            <Input
              type="date"
              label="To"
              value={dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Download"
            iconPosition="left"
            onClick={onExportData}
          >
            Export Data
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Settings"
            iconPosition="left"
            onClick={onBulkOperations}
          >
            Bulk Operations
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            iconName="RotateCcw"
            iconPosition="left"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapSidebar;