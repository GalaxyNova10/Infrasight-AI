import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
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

  // Mock dashboard metrics
  const dashboardMetrics = [
    {
      title: 'Active Issues',
      value: '47',
      change: '+12%',
      changeType: 'increase',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      title: 'Resolution Rate',
      value: '89%',
      change: '+5%',
      changeType: 'increase',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'AI Detections Today',
      value: '156',
      change: '+23%',
      changeType: 'increase',
      icon: 'Brain',
      color: 'primary'
    },
    {
      title: 'Average Response Time',
      value: '2.4h',
      change: '-15%',
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Chennai Infrastructure Dashboard
              </h1>
              <p className="text-text-secondary">
                Real-time monitoring and AI-powered issue detection for Greater Chennai Corporation • Last updated: {currentTime.toLocaleTimeString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsFilterPanelOpen(true)}
                iconName="Filter"
                iconPosition="left"
              >
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
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
              
              <Link to="/analytics-dashboard">
                <Button
                  variant="default"
                  iconName="BarChart3"
                  iconPosition="left"
                >
                  View Analytics
                </Button>
              </Link>
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
            <div className="lg:col-span-2">
              <InteractiveMap />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Video Feed Panel */}
              <VideoFeedPanel />
              
              {/* Recent Alerts Panel */}
              <RecentAlertsPanel />
            </div>
          </div>

          {/* Issues Summary Table */}
          <div className="mb-8">
            <IssuesSummaryTable />
          </div>

          {/* System Status */}
          <div className="mt-8 bg-surface border border-border rounded-lg p-4 shadow-elevation-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-text-secondary">System Status: All systems operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Wifi" size={16} className="text-green-500" />
                  <span className="text-sm text-text-secondary">AI Detection: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={16} className="text-green-500" />
                  <span className="text-sm text-text-secondary">GCC Data Sync: Real-time</span>
                </div>
              </div>
              
              <div className="text-sm text-text-secondary">
                Last system check: {new Date().toLocaleString()}
              </div>
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