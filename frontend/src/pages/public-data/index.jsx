import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const PublicDataPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data - in real implementation, this would come from API
  const mockData = {
    summary: {
      totalIssues: 1247,
      resolvedIssues: 1058,
      resolutionRate: 84.8,
      activeIssues: 189,
      avgResolutionTime: 2.3
    },
    issuesByCategory: [
      { category: 'Potholes / Bad Roads', count: 342, percentage: 27.4 },
      { category: 'Waterlogging / Flooding', count: 298, percentage: 23.9 },
      { category: 'Garbage Disposal', count: 187, percentage: 15.0 },
      { category: 'Street Lighting', count: 156, percentage: 12.5 },
      { category: 'Sewage Issues', count: 134, percentage: 10.7 },
      { category: 'Traffic Congestion', count: 89, percentage: 7.1 },
      { category: 'Other', count: 41, percentage: 3.3 }
    ],
    issuesByArea: [
      { area: 'T. Nagar', count: 156, resolved: 142 },
      { area: 'Adyar', count: 134, resolved: 118 },
      { area: 'Mylapore', count: 123, resolved: 105 },
      { area: 'Anna Nagar', count: 98, resolved: 87 },
      { area: 'Velachery', count: 89, resolved: 76 },
      { area: 'Besant Nagar', count: 76, resolved: 68 },
      { area: 'Guindy', count: 67, resolved: 59 },
      { area: 'Sholinganallur', count: 54, resolved: 48 }
    ],
    monthlyTrends: [
      { month: 'Jan', reported: 89, resolved: 76 },
      { month: 'Feb', reported: 92, resolved: 84 },
      { month: 'Mar', reported: 78, resolved: 71 },
      { month: 'Apr', reported: 85, resolved: 79 },
      { month: 'May', reported: 103, resolved: 91 },
      { month: 'Jun', reported: 156, resolved: 134 },
      { month: 'Jul', reported: 198, resolved: 167 },
      { month: 'Aug', reported: 145, resolved: 128 },
      { month: 'Sep', reported: 112, resolved: 98 },
      { month: 'Oct', reported: 89, resolved: 82 },
      { month: 'Nov', reported: 76, resolved: 69 },
      { month: 'Dec', reported: 64, resolved: 59 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/public-data');
        // const data = await response.json();
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        setError('Failed to load public data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-pink-500'
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading public data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Public Data - Chennai Civic Watch</title>
        <meta name="description" content="Public data and statistics about infrastructure issues and resolutions in Chennai." />
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
                <Link to="/my-reports" className="text-text-secondary hover:text-primary transition-colors">
                  My Reports
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
            <h1 className="text-4xl font-bold text-text-primary mb-4">Public Data</h1>
            <p className="text-xl text-text-secondary">
              Transparency in action. View high-level statistics about infrastructure issues and resolutions across Chennai.
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Total Issues</p>
                  <p className="text-3xl font-bold text-text-primary">{mockData.summary.totalIssues.toLocaleString()}</p>
                </div>
                <Icon name="FileText" size={32} className="text-primary" />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Resolved Issues</p>
                  <p className="text-3xl font-bold text-green-600">{mockData.summary.resolvedIssues.toLocaleString()}</p>
                </div>
                <Icon name="CheckCircle" size={32} className="text-green-600" />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Resolution Rate</p>
                  <p className="text-3xl font-bold text-blue-600">{mockData.summary.resolutionRate}%</p>
                </div>
                <Icon name="TrendingUp" size={32} className="text-blue-600" />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Avg. Resolution Time</p>
                  <p className="text-3xl font-bold text-orange-600">{mockData.summary.avgResolutionTime} days</p>
                </div>
                <Icon name="Clock" size={32} className="text-orange-600" />
              </div>
            </div>
          </div>

          {/* Issues by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-6">Issues by Category</h3>
              <div className="space-y-4">
                {mockData.issuesByCategory.map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${getCategoryColor(index)}`}></div>
                      <span className="text-text-primary">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-text-primary font-medium">{item.count}</p>
                      <p className="text-text-secondary text-sm">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-6">Issues by Area</h3>
              <div className="space-y-4">
                {mockData.issuesByArea.map((item) => (
                  <div key={item.area} className="flex items-center justify-between">
                    <span className="text-text-primary">{item.area}</span>
                    <div className="text-right">
                      <p className="text-text-primary font-medium">{item.count} total</p>
                      <p className="text-green-600 text-sm">{item.resolved} resolved</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-surface border border-border rounded-lg p-6 mb-12">
            <h3 className="text-xl font-semibold text-text-primary mb-6">Monthly Trends (2024)</h3>
            <div className="grid grid-cols-12 gap-2">
              {mockData.monthlyTrends.map((item) => (
                <div key={item.month} className="text-center">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm font-medium text-text-primary">{item.month}</p>
                    <p className="text-xs text-text-secondary">Reported: {item.reported}</p>
                    <p className="text-xs text-green-600">Resolved: {item.resolved}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Most Common Issues</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Potholes and road damage (27.4% of all issues)</li>
                  <li>• Waterlogging during monsoon (23.9% of all issues)</li>
                  <li>• Garbage disposal problems (15.0% of all issues)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Performance Highlights</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• 84.8% overall resolution rate</li>
                  <li>• Average resolution time: 2.3 days</li>
                  <li>• T. Nagar has the highest issue volume</li>
                  <li>• Street lighting issues resolved fastest</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-text-secondary mb-4">
              Want to contribute to improving Chennai's infrastructure?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Report an Issue
                </button>
              </Link>
              <Link to="/login">
                <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                  Official Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicDataPage; 