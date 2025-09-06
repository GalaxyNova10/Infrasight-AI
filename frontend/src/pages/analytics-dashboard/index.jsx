import React, { useState, useEffect } from 'react';
import MetricsOverview from './components/MetricsOverview';
import FilterPanel from './components/FilterPanel';
import TrendChart from './components/TrendChart';
import DepartmentPerformance from './components/DepartmentPerformance';
import IssueTypeDistribution from './components/IssueTypeDistribution';
import GeographicHeatMap from './components/GeographicHeatMap';
import PredictiveInsights from './components/PredictiveInsights';
import ResolutionTimeAnalysis from './components/ResolutionTimeAnalysis';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AnalyticsDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: '30days',
    department: 'all',
    issueType: 'all',
    location: 'all',
    severity: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Simulate data refresh
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1500);
  };

  const handleExportReport = () => {
    // Simulate report generation
    console.log('Generating comprehensive analytics report...');
  };

  const formatLastUpdated = (date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-10 px-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">
              In-depth insights into Chennai's infrastructure.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="text-sm text-gray-600">
              Last updated: {formatLastUpdated(lastUpdated)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshData}
              loading={isLoading}
              iconName="RefreshCw"
              iconSize={16}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportReport}
              iconName="Download"
              iconSize={16}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg flex items-center space-x-3">
              <Icon name="Loader2" size={20} className="text-primary animate-spin" />
              <span className="text-gray-700">Updating analytics data...</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
          <FilterPanel onFiltersChange={handleFiltersChange} />
        </div>

        {/* Key Metrics Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Metrics Overview</h2>
          <MetricsOverview />
        </div>

        {/* Main Analytics Grid */}
        <div className="space-y-8">
          {/* Trend Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Trend Analysis</h2>
            <TrendChart />
          </div>

          {/* Department Performance & Issue Distribution */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Department Performance</h2>
              <DepartmentPerformance />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Issue Type Distribution</h2>
              <IssueTypeDistribution />
            </div>
          </div>

          {/* Geographic Heat Map */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Geographic Heat Map</h2>
            <GeographicHeatMap />
          </div>

          {/* Resolution Time Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resolution Time Analysis</h2>
            <ResolutionTimeAnalysis />
          </div>

          {/* Predictive Insights */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Predictive Insights</h2>
            <PredictiveInsights />
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
              <p className="text-sm text-gray-600">
                Generate reports, schedule maintenance, or configure analytics settings.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm" iconName="Calendar" iconSize={16}>
                Schedule Report
              </Button>
              <Button variant="outline" size="sm" iconName="Settings" iconSize={16}>
                Configure Alerts
              </Button>
              <Button variant="outline" size="sm" iconName="FileText" iconSize={16}>
                View Historical Data
              </Button>
              <Button variant="primary" size="sm" iconName="Plus" iconSize={16}>
                Create Custom Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
