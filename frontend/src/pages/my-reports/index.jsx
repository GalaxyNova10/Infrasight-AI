import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data - in real implementation, this would come from API
  const mockReports = [
    {
      id: 'CHEN-9821',
      title: 'Sewage Overflow near Kapaleeshwarar Temple',
      category: 'Open Drains / Sewage Issues',
      location: 'Mylapore',
      status: 'Resolved',
      submittedDate: '2024-01-15T10:30:00Z',
      resolvedDate: '2024-01-17T14:20:00Z',
      description: 'Severe sewage overflow causing health hazards near the temple area',
      priority: 'High',
      assignedTo: 'GCC Sanitation Department',
      updates: [
        {
          date: '2024-01-15T11:00:00Z',
          message: 'Report received and assigned to sanitation team'
        },
        {
          date: '2024-01-16T09:30:00Z',
          message: 'Team dispatched to location for assessment'
        },
        {
          date: '2024-01-17T14:20:00Z',
          message: 'Issue resolved. Sewage line repaired and area cleaned'
        }
      ]
    },
    {
      id: 'CHEN-9822',
      title: 'Large Pothole on Anna Salai',
      category: 'Potholes / Bad Roads',
      location: 'Anna Salai',
      status: 'In Progress',
      submittedDate: '2024-01-18T08:15:00Z',
      description: 'Large pothole causing traffic disruption and vehicle damage',
      priority: 'Medium',
      assignedTo: 'GCC Roads Department',
      updates: [
        {
          date: '2024-01-18T09:00:00Z',
          message: 'Report received and assigned to roads department'
        },
        {
          date: '2024-01-19T10:30:00Z',
          message: 'Site inspection completed. Repair work scheduled'
        }
      ]
    },
    {
      id: 'CHEN-9823',
      title: 'Street Light Outage in T. Nagar',
      category: 'Poor Street Lighting',
      location: 'T. Nagar',
      status: 'New',
      submittedDate: '2024-01-20T19:45:00Z',
      description: 'Multiple street lights not working in shopping district',
      priority: 'Medium',
      assignedTo: 'GCC Electrical Department',
      updates: [
        {
          date: '2024-01-20T20:00:00Z',
          message: 'Report received and queued for processing'
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchReports = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/my-reports');
        // const data = await response.json();
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReports(mockReports);
      } catch (err) {
        setError('Failed to load your reports. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'New':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Reports - Chennai Civic Watch</title>
        <meta name="description" content="Track the status of your reported infrastructure issues in Chennai." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={20} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-text-primary">Chennai Civic Watch</span>
                  <span className="text-xs text-text-secondary">Chennai Municipal Infrastructure</span>
                </div>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link to="/report" className="text-text-secondary hover:text-primary transition-colors">
                  Report Issue
                </Link>
                <Link to="/public-data" className="text-text-secondary hover:text-primary transition-colors">
                  Public Data
                </Link>
                <Link to="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Official Login
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-text-primary mb-4">My Reports</h1>
            <p className="text-xl text-text-secondary">
              Track the status of issues you've reported to the Greater Chennai Corporation
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={20} className="text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {reports.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="FileText" size={64} className="text-text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">No Reports Yet</h3>
              <p className="text-text-secondary mb-6">
                You haven't submitted any reports yet. Start by reporting an infrastructure issue.
              </p>
              <Link to="/report">
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Report an Issue
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {reports.map((report) => (
                <div key={report.id} className="bg-surface border border-border rounded-lg shadow-elevation-2 overflow-hidden">
                  {/* Report Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-text-primary">{report.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                            {report.priority} Priority
                          </span>
                        </div>
                        <p className="text-text-secondary mb-3">{report.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-text-secondary">
                          <span>📍 {report.location}</span>
                          <span>📋 {report.category}</span>
                          <span>👤 {report.assignedTo}</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-text-secondary">
                        <div>Report ID: {report.id}</div>
                        <div>Submitted: {formatDate(report.submittedDate)}</div>
                        {report.resolvedDate && (
                          <div>Resolved: {formatDate(report.resolvedDate)}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Updates Timeline */}
                  <div className="p-6">
                    <h4 className="font-semibold text-text-primary mb-4">Updates</h4>
                    <div className="space-y-4">
                      {report.updates.map((update, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-text-primary">{update.message}</p>
                            <p className="text-sm text-text-secondary">{formatDate(update.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Link to="/report">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Report Another Issue
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyReportsPage; 