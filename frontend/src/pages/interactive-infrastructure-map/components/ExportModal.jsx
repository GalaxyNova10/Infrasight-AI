import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportModal = ({ isOpen, onClose, onExport, totalIssues, filteredIssues }) => {
  const [exportType, setExportType] = useState('');
  const [dataScope, setDataScope] = useState('filtered');
  const [includeImages, setIncludeImages] = useState(false);
  const [includeComments, setIncludeComments] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(false);
  const [selectedFields, setSelectedFields] = useState([
    'id', 'title', 'type', 'severity', 'status', 'location', 'reportedAt'
  ]);

  const exportTypeOptions = [
    { value: 'csv', label: 'CSV File (.csv)' },
    { value: 'excel', label: 'Excel Spreadsheet (.xlsx)' },
    { value: 'pdf', label: 'PDF Report (.pdf)' },
    { value: 'json', label: 'JSON Data (.json)' },
    { value: 'kml', label: 'KML for Google Earth (.kml)' },
    { value: 'geojson', label: 'GeoJSON (.geojson)' }
  ];

  const dataScopeOptions = [
    { value: 'filtered', label: `Filtered Results (${filteredIssues} issues)` },
    { value: 'all', label: `All Issues (${totalIssues} issues)` },
    { value: 'selected', label: 'Selected Issues Only' }
  ];

  const availableFields = [
    { id: 'id', label: 'Issue ID', required: true },
    { id: 'title', label: 'Title', required: true },
    { id: 'description', label: 'Description' },
    { id: 'type', label: 'Issue Type' },
    { id: 'severity', label: 'Severity Level' },
    { id: 'status', label: 'Current Status' },
    { id: 'location', label: 'Location/Address' },
    { id: 'coordinates', label: 'GPS Coordinates' },
    { id: 'reportedAt', label: 'Reported Date' },
    { id: 'reportedBy', label: 'Reported By' },
    { id: 'assignedTo', label: 'Assigned To' },
    { id: 'department', label: 'Department' },
    { id: 'priorityScore', label: 'Priority Score' },
    { id: 'estimatedCost', label: 'Estimated Cost' },
    { id: 'lastUpdated', label: 'Last Updated' }
  ];

  const handleFieldToggle = (fieldId, checked) => {
    if (checked) {
      setSelectedFields([...selectedFields, fieldId]);
    } else {
      // Don't allow unchecking required fields
      const field = availableFields.find(f => f.id === fieldId);
      if (!field?.required) {
        setSelectedFields(selectedFields.filter(id => id !== fieldId));
      }
    }
  };

  const handleExport = () => {
    const exportConfig = {
      type: exportType,
      scope: dataScope,
      fields: selectedFields,
      options: {
        includeImages,
        includeComments,
        includeHistory
      }
    };

    onExport(exportConfig);
    onClose();
  };

  const getExportDescription = () => {
    switch (exportType) {
      case 'csv':
        return 'Comma-separated values file for spreadsheet applications';
      case 'excel':
        return 'Microsoft Excel format with formatting and charts';
      case 'pdf':
        return 'Formatted report with maps and visualizations';
      case 'json':
        return 'Raw data in JSON format for developers';
      case 'kml':
        return 'Geographic data for Google Earth and mapping tools';
      case 'geojson':
        return 'Geographic data in GeoJSON format for GIS applications';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1100">
      <div className="bg-surface border border-border rounded-lg shadow-elevation-3 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Export Data</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Export infrastructure data in your preferred format
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Export Type */}
          <div>
            <Select
              label="Export Format"
              options={exportTypeOptions}
              value={exportType}
              onChange={setExportType}
              placeholder="Select export format"
              required
            />
            {exportType && (
              <p className="text-sm text-text-secondary mt-2">
                {getExportDescription()}
              </p>
            )}
          </div>

          {/* Data Scope */}
          <Select
            label="Data Scope"
            options={dataScopeOptions}
            value={dataScope}
            onChange={setDataScope}
            required
          />

          {/* Field Selection */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">
              Select Fields to Include
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
              {availableFields.map((field) => (
                <Checkbox
                  key={field.id}
                  label={
                    <span className="flex items-center space-x-2">
                      <span>{field.label}</span>
                      {field.required && (
                        <span className="text-xs text-red-500">*</span>
                      )}
                    </span>
                  }
                  checked={selectedFields.includes(field.id)}
                  onChange={(e) => handleFieldToggle(field.id, e.target.checked)}
                  disabled={field.required}
                />
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-2">
              * Required fields cannot be deselected
            </p>
          </div>

          {/* Additional Options */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">
              Additional Options
            </h3>
            <div className="space-y-2">
              <Checkbox
                label="Include issue images and attachments"
                description="May significantly increase file size"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
              />
              <Checkbox
                label="Include comments and notes"
                checked={includeComments}
                onChange={(e) => setIncludeComments(e.target.checked)}
              />
              <Checkbox
                label="Include status change history"
                description="Complete audit trail of all changes"
                checked={includeHistory}
                onChange={(e) => setIncludeHistory(e.target.checked)}
              />
            </div>
          </div>

          {/* Export Summary */}
          {exportType && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium text-text-primary mb-2">Export Summary</h4>
              <div className="space-y-1 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-medium">{exportType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Records:</span>
                  <span className="font-medium">
                    {dataScope === 'filtered' ? filteredIssues : 
                     dataScope === 'all' ? totalIssues : 'Selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fields:</span>
                  <span className="font-medium">{selectedFields.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleExport}
              disabled={!exportType}
              iconName="Download"
              iconPosition="left"
              className="flex-1"
            >
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;