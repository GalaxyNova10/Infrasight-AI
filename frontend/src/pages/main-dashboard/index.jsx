import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricCard from './components/MetricCard';
import InteractiveMap from './components/InteractiveMap';
import VideoFeedPanel from './components/VideoFeedPanel';
import RecentAlertsPanel from './components/RecentAlertsPanel';
import IssuesSummaryTable from './components/IssuesSummaryTable';
import FilterPanel from './components/FilterPanel';

const MainDashboard = () => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [appliedFilters, setAppliedFilters] = useState({});

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock dashboard metrics (Chennai-specific)
  const dashboardMetrics = [
    {
      title: 'Active Issues (Chennai)',
      value: '123',
      change: '+8%',
      changeType: 'increase',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      title: 'Resolution Rate (Chennai)',
      value: '92%',
      change: '+3%',
      changeType: 'increase',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'AI Detections Today (Chennai)',
      value: '345',
      change: '+18%',
      changeType: 'increase',
      icon: 'Brain',
      color: 'primary'
    },
    {
      title: 'Average Response Time (Chennai)',
      value: '1.8h',
      change: '-10%',
      changeType: 'decrease',
      icon: 'Clock',
      color: 'success'
    }
  ];

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    // In a real app, this would trigger data refetch with filters
    console.log('Applied filters:', filters);
  };

  const getActiveFilterCount = () => {
    return Object.values(appliedFilters).reduce((count, filterArray) => {
      if (Array.isArray(filterArray)) {
        return count + filterArray.length;
      }
      if (filterArray && (filterArray.start || filterArray.end)) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-10 px-6">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome to InfraSight AI. Here's a real-time overview of Chennai's infrastructure.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              onClick={() => setIsFilterPanelOpen(true)}
              iconName="Filter"
              iconPosition="left"
            >
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
            
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
              icon={metric.icon}
              color={metric.color}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Interactive Map - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Infrastructure Map</h2>
            <InteractiveMap />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Video Feed Panel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Video Feeds</h2>
              <VideoFeedPanel />
            </div>
            
            {/* Recent Alerts Panel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Alerts</h2>
              <RecentAlertsPanel />
            </div>
          </div>
        </div>

        {/* Issues Summary Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Issues Summary</h2>
          <IssuesSummaryTable />
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-700">System Status: All systems operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Wifi" size={16} className="text-green-500" />
                <span className="text-sm text-gray-700">AI Detection: Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={16} className="text-green-500" />
                <span className="text-sm text-gray-700">GCC Data Sync: Real-time</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-700">
              Last system check: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </main>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default MainDashboard;
