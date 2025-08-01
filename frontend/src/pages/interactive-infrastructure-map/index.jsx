import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MapSidebar from './components/MapSidebar';
import MapControls from './components/MapControls';
import IssueMarkerPopup from './components/IssueMarkerPopup';
import MapLegend from './components/MapLegend';
import BulkOperationsModal from './components/BulkOperationsModal';
import ExportModal from './components/ExportModal';
import Icon from '../../components/AppIcon';


const InteractiveInfrastructureMap = () => {
  // Map state
  const [mapView, setMapView] = useState('street');
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [drawingMode, setDrawingMode] = useState('select');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedIssues, setSelectedIssues] = useState([]);
  
  // UI state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    issueTypes: ['potholes', 'leaks', 'lighting', 'waste'],
    departments: [],
    severity: [],
    status: [],
    dateRange: { start: '', end: '' }
  });

  // Mock issues data
  const mockIssues = [
    {
      id: 'ISS-2025-001',
      title: 'Large Pothole on Anna Salai',
      description: 'Deep pothole causing vehicle damage near intersection with Mount Road. Multiple citizen reports received.',
      type: 'potholes',
      severity: 'high',
      status: 'assigned',
      location: '1234 Anna Salai, T. Nagar',
      coordinates: { lat: 13.0827, lng: 80.2707 },
      reportedAt: '2025-07-28T10:30:00Z',
      reportedBy: 'Citizen Portal',
      assignedTo: 'John Doe',
      department: 'public-works',
      priorityScore: 85,
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg'
    },
    {
      id: 'ISS-2025-002',
      title: 'Water Main Break in Adyar',
      description: 'AI system detected potential water main break with visible water pooling and pressure drop.',
      type: 'waterlogging',
      severity: 'critical',
      status: 'in-progress',
      location: '567 Adyar Bridge Road, Adyar',
      coordinates: { lat: 13.0067, lng: 80.2566 },
      reportedAt: '2025-07-29T02:15:00Z',
      reportedBy: 'AI Detection System',
      assignedTo: 'Jane Smith',
      department: 'utilities',
      priorityScore: 95,
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg'
    },
    {
      id: 'ISS-2025-003',
      title: 'Street Light Malfunction in Mylapore',
      description: 'Multiple street lights not functioning on residential street, creating safety hazard.',
      type: 'streetlights',
      severity: 'medium',
      status: 'reported',
      location: '890 Santhome High Road, Mylapore',
      coordinates: { lat: 13.0377, lng: 80.2707 },
      reportedAt: '2025-07-27T18:45:00Z',
      reportedBy: 'Mike Johnson',
      assignedTo: null,
      department: 'public-works',
      priorityScore: 65,
      image: 'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg'
    },
    {
      id: 'ISS-2025-004',
      title: 'Overflowing Waste Bins in Velachery',
      description: 'Multiple waste bins overflowing in commercial district, attracting pests and creating unsanitary conditions.',
      type: 'garbage',
      severity: 'medium',
      status: 'assigned',
      location: '321 Velachery Main Road, Velachery',
      coordinates: { lat: 12.9789, lng: 80.2207 },
      reportedAt: '2025-07-28T14:20:00Z',
      reportedBy: 'Business Owner',
      assignedTo: 'Sarah Wilson',
      department: 'sanitation',
      priorityScore: 70,
      image: 'https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg'
    },
    {
      id: 'ISS-2025-005',
      title: 'Illegal Banners on OMR',
      description: 'Multiple illegal banners and posters obstructing traffic signals and creating visual pollution.',
      type: 'banners',
      severity: 'medium',
      status: 'reported',
      location: '456 Old Mahabalipuram Road, Sholinganallur',
      coordinates: { lat: 12.8994, lng: 80.2209 },
      reportedAt: '2025-07-26T09:15:00Z',
      reportedBy: 'Traffic Police',
      assignedTo: null,
      department: 'enforcement',
      priorityScore: 60,
      image: 'https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg'
    },
    {
      id: 'ISS-2025-006',
      title: 'Open Drain in Anna Nagar',
      description: 'Open drain causing foul smell and health hazard in residential area.',
      type: 'drains',
      severity: 'high',
      status: 'in-progress',
      location: '789 2nd Avenue, Anna Nagar',
      coordinates: { lat: 13.0827, lng: 80.2207 },
      reportedAt: '2025-07-25T16:30:00Z',
      reportedBy: 'Resident',
      assignedTo: 'Rajesh Kumar',
      department: 'sanitation',
      priorityScore: 80,
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg'
    }
  ];

  // Filter issues based on current filters
  const filteredIssues = mockIssues.filter(issue => {
    if (filters.issueTypes.length > 0 && !filters.issueTypes.includes(issue.type)) return false;
    if (filters.departments.length > 0 && !filters.departments.includes(issue.department)) return false;
    if (filters.severity.length > 0 && !filters.severity.includes(issue.severity)) return false;
    if (filters.status.length > 0 && !filters.status.includes(issue.status)) return false;
    
    if (filters.dateRange.start || filters.dateRange.end) {
      const issueDate = new Date(issue.reportedAt);
      if (filters.dateRange.start && issueDate < new Date(filters.dateRange.start)) return false;
      if (filters.dateRange.end && issueDate > new Date(filters.dateRange.end)) return false;
    }
    
    return true;
  });

  // Map event handlers
  const handleMapViewChange = (view) => {
    setMapView(view);
  };

  const handleHeatMapToggle = () => {
    setShowHeatMap(!showHeatMap);
  };

  const handleZoomIn = () => {
    console.log('Zooming in...');
  };

  const handleZoomOut = () => {
    console.log('Zooming out...');
  };

  const handleResetView = () => {
    console.log('Resetting map view...');
  };

  const handleDrawingModeChange = (mode) => {
    setDrawingMode(mode);
  };

  // Issue handlers
  const handleIssueMarkerClick = (issue) => {
    setSelectedIssue(issue);
  };

  const handleAssignIssue = (issueId) => {
    console.log('Assigning issue:', issueId);
    setSelectedIssue(null);
  };

  const handleUpdateStatus = (issueId) => {
    console.log('Updating status for issue:', issueId);
    setSelectedIssue(null);
  };

  const handleViewDetails = (issueId) => {
    console.log('Viewing details for issue:', issueId);
    setSelectedIssue(null);
  };

  // Bulk operations
  const handleBulkOperations = () => {
    if (selectedIssues.length === 0) {
      // Select all filtered issues for demo
      setSelectedIssues(filteredIssues.map(issue => issue.id));
    }
    setShowBulkModal(true);
  };

  const handleApplyBulkOperations = (operationData) => {
    console.log('Applying bulk operations:', operationData);
    setSelectedIssues([]);
  };

  // Export functionality
  const handleExportData = () => {
    setShowExportModal(true);
  };

  const handleExport = (exportConfig) => {
    console.log('Exporting data:', exportConfig);
    // Simulate export process
    setTimeout(() => {
      alert(`Export completed! ${filteredIssues.length} issues exported as ${exportConfig.type.toUpperCase()}`);
    }, 1000);
  };

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      console.log('Checking for real-time updates...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="px-6 py-4">
          <Breadcrumb />
        </div>

        {/* Map Container */}
        <div className="relative h-[calc(100vh-120px)]">
          {/* Map Sidebar */}
          <MapSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onExportData={handleExportData}
            onBulkOperations={handleBulkOperations}
          />

          {/* Main Map Area */}
          <div className={`transition-all duration-300 ${
            isSidebarCollapsed ? 'ml-0' : 'ml-80'
          } h-full relative`}>
            
            {/* Map Placeholder with Google Maps iframe */}
            <div className="w-full h-full bg-gray-100 relative overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Chennai Infrastructure Map"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=13.0827,80.2707&z=12&output=embed"
                className="border-0"
              />
              
              {/* Map Overlay for Demo Markers */}
              <div className="absolute inset-0 pointer-events-none">
                {filteredIssues.map((issue, index) => (
                  <div
                    key={issue.id}
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{
                      left: `${20 + (index * 15)}%`,
                      top: `${30 + (index * 10)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleIssueMarkerClick(issue)}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                      issue.severity === 'critical' ? 'bg-red-600' :
                      issue.severity === 'high' ? 'bg-orange-500' :
                      issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      <Icon 
                        name={
                          issue.type === 'potholes' ? 'AlertTriangle' :
                          issue.type === 'waterlogging' ? 'Droplets' :
                          issue.type === 'streetlights' ? 'Lightbulb' : 
                          issue.type === 'garbage' ? 'Trash2' :
                          issue.type === 'banners' ? 'Flag' :
                          issue.type === 'drains' ? 'Droplets' : 'AlertTriangle'
                        } 
                        size={12} 
                        color="white" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Heat Map Overlay */}
              {showHeatMap && (
                <div className="absolute inset-0 bg-gradient-radial from-red-500/30 via-yellow-500/20 to-transparent pointer-events-none" />
              )}
            </div>

            {/* Issue Popup */}
            {selectedIssue && (
              <div 
                className="absolute z-1000"
                style={{
                  left: '50%',
                  top: '40%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <IssueMarkerPopup
                  issue={selectedIssue}
                  onClose={() => setSelectedIssue(null)}
                  onAssign={handleAssignIssue}
                  onUpdateStatus={handleUpdateStatus}
                  onViewDetails={handleViewDetails}
                />
              </div>
            )}
          </div>

          {/* Map Controls */}
          <MapControls
            mapView={mapView}
            onMapViewChange={handleMapViewChange}
            showHeatMap={showHeatMap}
            onHeatMapToggle={handleHeatMapToggle}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            drawingMode={drawingMode}
            onDrawingModeChange={handleDrawingModeChange}
          />

          {/* Map Legend */}
          <MapLegend
            isVisible={showLegend}
            onToggle={() => setShowLegend(!showLegend)}
          />

          {/* Status Bar */}
          <div className="absolute bottom-4 right-4 left-4 lg:left-auto lg:right-4 lg:w-auto">
            <div className="bg-surface border border-border rounded-lg shadow-elevation-2 px-4 py-2">
              <div className="flex items-center justify-between space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={14} className="text-text-secondary" />
                  <span className="text-text-secondary">
                    Showing {filteredIssues.length} of {mockIssues.length} issues
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-text-secondary">Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <BulkOperationsModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          selectedIssues={selectedIssues}
          onApplyOperations={handleApplyBulkOperations}
        />

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          totalIssues={mockIssues.length}
          filteredIssues={filteredIssues.length}
        />
      </main>
    </div>
  );
};

export default InteractiveInfrastructureMap;