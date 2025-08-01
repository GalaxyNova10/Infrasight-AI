import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkOperationsModal = ({ isOpen, onClose, selectedIssues, onApplyOperations }) => {
  const [operation, setOperation] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');
  const [notes, setNotes] = useState('');
  const [sendNotifications, setSendNotifications] = useState(true);

  const operationOptions = [
    { value: 'assign', label: 'Assign to Team Member' },
    { value: 'status', label: 'Update Status' },
    { value: 'priority', label: 'Change Priority' },
    { value: 'department', label: 'Transfer Department' },
    { value: 'close', label: 'Close Issues' },
    { value: 'delete', label: 'Delete Issues' }
  ];

  const teamMembers = [
    { value: 'john-doe', label: 'John Doe - Public Works' },
    { value: 'jane-smith', label: 'Jane Smith - Utilities' },
    { value: 'mike-johnson', label: 'Mike Johnson - Sanitation' },
    { value: 'sarah-wilson', label: 'Sarah Wilson - Public Works' }
  ];

  const statusOptions = [
    { value: 'reported', label: 'Reported' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'critical', label: 'Critical Priority' }
  ];

  const departmentOptions = [
    { value: 'public-works', label: 'Public Works' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'sanitation', label: 'Sanitation' },
    { value: 'transportation', label: 'Transportation' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const operationData = {
      operation,
      selectedIssues,
      data: {
        assignTo,
        newStatus,
        priority,
        department,
        notes,
        sendNotifications
      }
    };

    onApplyOperations(operationData);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setOperation('');
    setAssignTo('');
    setNewStatus('');
    setPriority('');
    setDepartment('');
    setNotes('');
    setSendNotifications(true);
  };

  const renderOperationFields = () => {
    switch (operation) {
      case 'assign':
        return (
          <Select
            label="Assign to Team Member"
            options={teamMembers}
            value={assignTo}
            onChange={setAssignTo}
            placeholder="Select team member"
            required
          />
        );
      
      case 'status':
        return (
          <Select
            label="New Status"
            options={statusOptions}
            value={newStatus}
            onChange={setNewStatus}
            placeholder="Select new status"
            required
          />
        );
      
      case 'priority':
        return (
          <Select
            label="Priority Level"
            options={priorityOptions}
            value={priority}
            onChange={setPriority}
            placeholder="Select priority level"
            required
          />
        );
      
      case 'department':
        return (
          <Select
            label="Transfer to Department"
            options={departmentOptions}
            value={department}
            onChange={setDepartment}
            placeholder="Select department"
            required
          />
        );
      
      case 'close':
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                This will close {selectedIssues.length} issue(s)
              </span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Closed issues can be reopened later if needed.
            </p>
          </div>
        );
      
      case 'delete':
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-800">
                This will permanently delete {selectedIssues.length} issue(s)
              </span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              This action cannot be undone. All data will be lost.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1100">
      <div className="bg-surface border border-border rounded-lg shadow-elevation-3 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Bulk Operations</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Apply operations to {selectedIssues.length} selected issue(s)
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Operation Selection */}
          <Select
            label="Select Operation"
            options={operationOptions}
            value={operation}
            onChange={setOperation}
            placeholder="Choose an operation"
            required
          />

          {/* Operation-specific Fields */}
          {operation && (
            <div className="space-y-4">
              {renderOperationFields()}
            </div>
          )}

          {/* Notes */}
          {operation && operation !== 'delete' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this operation..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          )}

          {/* Notifications */}
          {operation && operation !== 'delete' && (
            <Checkbox
              label="Send notifications to affected team members"
              checked={sendNotifications}
              onChange={(e) => setSendNotifications(e.target.checked)}
            />
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={operation === 'delete' ? 'destructive' : 'default'}
              disabled={!operation}
              className="flex-1"
            >
              {operation === 'delete' ? 'Delete Issues' : 'Apply Operation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkOperationsModal;