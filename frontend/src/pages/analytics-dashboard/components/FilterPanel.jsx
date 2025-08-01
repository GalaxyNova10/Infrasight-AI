import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '30days',
    department: 'all',
    issueType: 'all',
    location: 'all',
    severity: 'all'
  });

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'public-works', label: 'Public Works' },
    { value: 'water-utilities', label: 'Water Utilities' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'parks-recreation', label: 'Parks & Recreation' },
    { value: 'waste-management', label: 'Waste Management' }
  ];

  const issueTypeOptions = [
    { value: 'all', label: 'All Issue Types' },
    { value: 'potholes', label: 'Potholes' },
    { value: 'water-leaks', label: 'Water Leaks' },
    { value: 'streetlights', label: 'Streetlight Issues' },
    { value: 'garbage-overflow', label: 'Garbage Overflow' },
    { value: 'road-damage', label: 'Road Damage' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'downtown', label: 'Downtown District' },
    { value: 'residential', label: 'Residential Areas' },
    { value: 'industrial', label: 'Industrial Zone' },
    { value: 'commercial', label: 'Commercial District' },
    { value: 'suburban', label: 'Suburban Areas' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: '30days',
      department: 'all',
      issueType: 'all',
      location: 'all',
      severity: 'all'
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  return (
    <div className="bg-surface border border-border rounded-lg mb-6">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="font-semibold text-text-primary">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            iconName="RotateCcw"
            iconSize={16}
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={filters.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />

            <Select
              label="Department"
              options={departmentOptions}
              value={filters.department}
              onChange={(value) => handleFilterChange('department', value)}
            />

            <Select
              label="Issue Type"
              options={issueTypeOptions}
              value={filters.issueType}
              onChange={(value) => handleFilterChange('issueType', value)}
            />

            <Select
              label="Location"
              options={locationOptions}
              value={filters.location}
              onChange={(value) => handleFilterChange('location', value)}
            />

            <Select
              label="Severity"
              options={severityOptions}
              value={filters.severity}
              onChange={(value) => handleFilterChange('severity', value)}
            />
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-text-secondary">
              Showing data for: <span className="font-medium text-text-primary">Last 30 Days, All Departments</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="Download" iconSize={16}>
                Export Data
              </Button>
              <Button variant="default" size="sm" iconName="RefreshCw" iconSize={16}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;