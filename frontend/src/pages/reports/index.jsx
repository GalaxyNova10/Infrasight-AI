import React, { useState, useEffect, useCallback } from 'react';
import { getIssues, createWorkOrder } from '../../services/api';
import { Helmet } from 'react-helmet-async';

// Mock data for departments, you can fetch this from an API later
const departments = [
  { id: 'public_works', name: 'Public Works' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'transportation', name: 'Transportation' },
  { id: 'sanitation', name: 'Sanitation' },
  { id: 'parks_recreation', name: 'Parks & Recreation' },
];

const WorkOrderModal = ({ issue, onClose, onWorkOrderCreated }) => {
  const [department, setDepartment] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!department) {
      setError('Please select a department.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const workOrderData = {
        issue_id: issue.id,
        title: `Work Order for: ${issue.title}`,
        description: issue.description,
        department: department,
        notes: notes,
      };
      await createWorkOrder(workOrderData);
      onWorkOrderCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create work order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Work Order</h2>
        <p className="mb-2"><strong>Issue:</strong> {issue.title}</p>
        <p className="mb-4"><strong>Location:</strong> {issue.address}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Assign to Department</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>Select a department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              id="notes"
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Add any relevant notes for the assigned department..."
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
              {isSubmitting ? 'Assigning...' : 'Assign Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReportCard = ({ report, onAssign }) => {
  const BACKEND_URL = 'http://localhost:8000';
  const imageUrl = report.media && report.media.length > 0 ? `${BACKEND_URL}${report.media[0].file_url}` : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800">{report.title}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {report.priority}
          </span>
        </div>
        <p className="text-sm text-gray-600">{report.issue_type.replace(/_/g, ' ').toUpperCase()}</p>
        <p className="text-sm text-gray-500 mt-1">{report.address}</p>
      </div>
      <div className="p-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Reporter Details</h4>
        <p className="text-sm text-gray-600"><strong>Name:</strong> {report.reporter?.full_name || 'N/A'}</p>
        <p className="text-sm text-gray-600"><strong>Email:</strong> {report.reporter?.email || 'N/A'}</p>
        <p className="text-sm text-gray-600"><strong>Phone:</strong> {report.reporter?.phone || 'N/A'}</p>
      </div>
      <div className="p-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Analysis</h4>
          {imageUrl ? (
            <img src={imageUrl} alt="Annotated" className="w-full h-48 object-cover rounded-md mb-2" />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center mb-2">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
          <p className="text-sm text-gray-600"><strong>Severity Score:</strong> {report.priority.length * 25}%</p>
      </div>
      {report.status !== 'resolved' && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button 
            onClick={() => onAssign(report)}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
            Create Work Order
          </button>
        </div>
      )}
    </div>
  );
};

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('detected');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const status = activeTab;
      const response = await getIssues(status);
      setReports(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch reports.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <>
      <Helmet>
        <title>Admin Reports Dashboard - InfraSight AI</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Reports Dashboard</h1>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('detected')}
              className={`${activeTab === 'detected' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Reports
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`${activeTab === 'resolved' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Completed Reports
            </button>
          </nav>
        </div>

        <div className="mt-8">
          {loading && <p>Loading reports...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map(report => (
                <ReportCard key={report.id} report={report} onAssign={setSelectedIssue} />
              ))}
            </div>
          )}
          {!loading && !error && reports.length === 0 && (
            <p>No {activeTab === 'detected' ? 'pending' : activeTab} reports found.</p>
          )}
        </div>
      </div>
      {selectedIssue && (
        <WorkOrderModal 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
          onWorkOrderCreated={() => {
            fetchReports(); // Refresh the list after creating a work order
            setSelectedIssue(null);
          }}
        />
      )}
    </>
  );
};

export default ReportsPage;