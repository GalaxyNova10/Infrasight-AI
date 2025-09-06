import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import MapSidebar from './components/MapSidebar';
import MapControls from './components/MapControls';
import IssueMarkerPopup from './components/IssueMarkerPopup';
import MapLegend from './components/MapLegend';
import BulkOperationsModal from './components/BulkOperationsModal';
import ExportModal from './components/ExportModal';

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

  // Mock issues data (Chennai-specific)
  const mockIssues = [
    {
      id: 'ISS-2025-001',
      title: 'Large Pothole on Anna Salai',
      description: 'Deep pothole causing vehicle damage near intersection with Mount Road. Multiple citizen reports received.',
      type: 'potholes',
      severity: 'high',
      status: 'assigned',
      location: 'Anna Salai, Chennai',
      coordinates: { lat: 13.0625, lng: 80.2500 },
      reportedAt: '2025-07-28T10:30:00Z',
      reportedBy: 'Citizen Portal',
      assignedTo: 'John Doe',
      department: 'public-works',
      priorityScore: 85,
      image: '/assets/images/no_image.png'
    },
    {
      id: 'ISS-2025-002',
      title: 'Water Leak near Marina Beach',
      description: 'Significant water leakage observed near the lighthouse, causing inconvenience to pedestrians.',
      type: 'leaks',
      severity: 'medium',
      status: 'reported',
      location: 'Marina Beach, Chennai',
      coordinates: { lat: 13.0580, lng: 80.2820 },
      reportedAt: '2025-07-27T14:00:00Z',
      reportedBy: 'Citizen Portal',
      assignedTo: null,
      department: 'water-utilities',
      priorityScore: 70,
      image: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg'
    },
    {
      id: 'ISS-2025-003',
      title: 'Non-functional Streetlight in Besant Nagar',
      description: 'Streetlight near Elliot\'s Beach not working, making the area dark and unsafe at night.',
      type: 'lighting',
      severity: 'low',
      status: 'in-progress',
      location: 'Besant Nagar, Chennai',
      coordinates: { lat: 12.9900, lng: 80.2680 },
      reportedAt: '2025-07-26T09:15:00Z',
      reportedBy: 'Citizen Portal',
      assignedTo: 'Jane Smith',
      department: 'electricity-board',
      priorityScore: 60,
      image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg'
    },
    {
      id: 'ISS-2025-004',
      title: 'Garbage Overflow in T. Nagar',
      description: 'Dustbins overflowing near Panagal Park, attracting pests and causing foul smell.',
      type: 'waste',
      severity: 'high',
      status: 'reported',
      location: 'T. Nagar, Chennai',
      coordinates: { lat: 13.0400, lng: 80.2300 },
      reportedAt: '2025-07-25T11:00:00Z',
      reportedBy: 'Citizen Portal',
      assignedTo: null,
      department: 'sanitation',
      priorityScore: 80,
      image: 'https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg'
    },
    {
      id: 'ISS-2025-005',
      title: 'Damaged Road in Adyar',
      description: 'Portion of the road near Adyar Bridge has caved in, posing a risk to vehicles.',
      type: 'road-damage',
      severity: 'critical',
      status: 'assigned',
      location: 'Adyar, Chennai',
      coordinates: { lat: 13.0080, lng: 80.2500 },
      reportedAt: '2025-07-24T16:45:00Z',
      reportedBy: 'Citizen Portal',
      assignedTo: 'David Lee',
      department: 'public-works',
      priorityScore: 90,
      image: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg'
    },
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

  const chennaiCoordinates = [13.0827, 80.2707]; // Latitude and Longitude for Chennai

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1">
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
        <div className="flex-1 relative">
          {/* Map Container */}
          <MapContainer center={chennaiCoordinates} zoom={13} className="w-full h-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredIssues.map(issue => (
              <Marker
                key={issue.id}
                position={[issue.coordinates.lat, issue.coordinates.lng]}
                eventHandlers={{
                  click: () => handleIssueMarkerClick(issue),
                }}
              >
                <Popup>
                  <div>
                    <h3>{issue.title}</h3>
                    <p>{issue.description}</p>
                    <p>Status: {issue.status}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

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

          
        </div>
      </main>

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
    </div>
  );
};

export default InteractiveInfrastructureMap;