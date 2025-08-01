import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    issueTypes: [],
    departments: [],
    severityLevels: [],
    statusTypes: [],
    dateRange: {
      start: '',
      end: ''
    },
    reportedBy: [],
    assignedTo: []
  });

  // Mock filter options
  const filterOptions = {
    issueTypes: [
      { id: 'pothole', label: 'Potholes', count: 23 },
      { id: 'water_leak', label: 'Water Leaks', count: 8 },
      { id: 'streetlight', label: 'Streetlight Issues', count: 15 },
      { id: 'garbage_overflow', label: 'Garbage Overflow', count: 12 },
      { id: 'traffic_signal', label: 'Traffic Signals', count: 5 },
      { id: 'road_damage', label: 'Road Damage', count: 18 }
    ],
    departments: [
      { id: 'public_works', label: 'Public Works', count: 41 },
      { id: 'water_sewer', label: 'Water & Sewer', count: 8 },
      { id: 'electrical', label: 'Electrical', count: 20 },
      { id: 'sanitation', label: 'Sanitation', count: 12 },
      { id: 'traffic', label: 'Traffic', count: 5 }
    ],
    severityLevels: [
      { id: 'critical', label: 'Critical', count: 3, color: 'text-red-600' },
      { id: 'high', label: 'High', count: 15, color: 'text-amber-600' },
      { id: 'medium', label: 'Medium', count: 42, color: 'text-blue-600' },
      { id: 'low', label: 'Low', count: 21, color: 'text-green-600' }
    ],
    statusTypes: [
      { id: 'pending', label: 'Pending', count: 28 },
      { id: 'assigned', label: 'Assigned', count: 19 },
      { id: 'in_progress', label: 'In Progress', count: 15 },
      { id: 'resolved', label: 'Resolved', count: 19 }
    ],
    reportedBy: [
      { id: 'ai_detection', label: 'AI Detection', count: 52 },
      { id: 'citizen_report', label: 'Citizen Reports', count: 23 },
      { id: 'field_inspection', label: 'Field Inspection', count: 6 }
    ]
  };

  const handleFilterChange = (category, value, checked) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const handleDateRangeChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      issueTypes: [],
      departments: [],
      severityLevels: [],
      statusTypes: [],
      dateRange: { start: '', end: '' },
      reportedBy: [],
      assignedTo: []
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => {
      if (Array.isArray(filterArray)) {
        return count + filterArray.length;
      }
      if (filterArray.start || filterArray.end) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      
      {/* Filter Panel */}
      <div className="fixed left-0 top-16 bottom-0 w-80 bg-surface border-r border-border shadow-elevation-3 z-50 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
              {getActiveFilterCount() > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Date Range */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Date Range</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-text-secondary mb-1">From</label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">To</label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
                />
              </div>
            </div>
          </div>

          {/* Issue Types */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Issue Types</h4>
            <div className="space-y-2">
              {filterOptions.issueTypes.map((option) => (
                <div key={option.id} className="flex items-center justify-between">
                  <Checkbox
                    label={option.label}
                    checked={filters.issueTypes.includes(option.id)}
                    onChange={(e) => handleFilterChange('issueTypes', option.id, e.target.checked)}
                  />
                  <span className="text-sm text-text-secondary">({option.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Departments</h4>
            <div className="space-y-2">
              {filterOptions.departments.map((option) => (
                <div key={option.id} className="flex items-center justify-between">
                  <Checkbox
                    label={option.label}
                    checked={filters.departments.includes(option.id)}
                    onChange={(e) => handleFilterChange('departments', option.id, e.target.checked)}
                  />
                  <span className="text-sm text-text-secondary">({option.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Levels */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Severity Levels</h4>
            <div className="space-y-2">
              {filterOptions.severityLevels.map((option) => (
                <div key={option.id} className="flex items-center justify-between">
                  <Checkbox
                    label={
                      <span className={option.color}>
                        {option.label}
                      </span>
                    }
                    checked={filters.severityLevels.includes(option.id)}
                    onChange={(e) => handleFilterChange('severityLevels', option.id, e.target.checked)}
                  />
                  <span className="text-sm text-text-secondary">({option.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Types */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Status</h4>
            <div className="space-y-2">
              {filterOptions.statusTypes.map((option) => (
                <div key={option.id} className="flex items-center justify-between">
                  <Checkbox
                    label={option.label}
                    checked={filters.statusTypes.includes(option.id)}
                    onChange={(e) => handleFilterChange('statusTypes', option.id, e.target.checked)}
                  />
                  <span className="text-sm text-text-secondary">({option.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reported By */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Reported By</h4>
            <div className="space-y-2">
              {filterOptions.reportedBy.map((option) => (
                <div key={option.id} className="flex items-center justify-between">
                  <Checkbox
                    label={option.label}
                    checked={filters.reportedBy.includes(option.id)}
                    onChange={(e) => handleFilterChange('reportedBy', option.id, e.target.checked)}
                  />
                  <span className="text-sm text-text-secondary">({option.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              fullWidth
              onClick={clearAllFilters}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Clear All
            </Button>
            <Button
              variant="default"
              fullWidth
              onClick={applyFilters}
              iconName="Filter"
              iconPosition="left"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;