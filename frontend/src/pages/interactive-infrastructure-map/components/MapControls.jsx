import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapControls = ({ 
  mapView, 
  onMapViewChange, 
  showHeatMap, 
  onHeatMapToggle,
  onZoomIn,
  onZoomOut,
  onResetView,
  drawingMode,
  onDrawingModeChange
}) => {
  const [isDrawingMenuOpen, setIsDrawingMenuOpen] = useState(false);

  const drawingTools = [
    { id: 'select', label: 'Select', icon: 'MousePointer' },
    { id: 'rectangle', label: 'Rectangle', icon: 'Square' },
    { id: 'circle', label: 'Circle', icon: 'Circle' },
    { id: 'polygon', label: 'Polygon', icon: 'Pentagon' }
  ];

  const handleDrawingToolSelect = (toolId) => {
    onDrawingModeChange(toolId);
    setIsDrawingMenuOpen(false);
  };

  return (
    <div className="fixed right-4 top-20 z-1000 space-y-3">
      {/* Map View Toggle */}
      <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-2">
        <div className="flex flex-col space-y-1">
          <Button
            variant={mapView === 'street' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onMapViewChange('street')}
            className="justify-start"
          >
            <Icon name="Map" size={16} className="mr-2" />
            Street
          </Button>
          <Button
            variant={mapView === 'satellite' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onMapViewChange('satellite')}
            className="justify-start"
          >
            <Icon name="Satellite" size={16} className="mr-2" />
            Satellite
          </Button>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-2">
        <div className="flex flex-col space-y-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomIn}
            title="Zoom In"
          >
            <Icon name="Plus" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomOut}
            title="Zoom Out"
          >
            <Icon name="Minus" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onResetView}
            title="Reset View"
          >
            <Icon name="Home" size={16} />
          </Button>
        </div>
      </div>

      {/* Heat Map Toggle */}
      <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-2">
        <Button
          variant={showHeatMap ? 'default' : 'ghost'}
          size="sm"
          onClick={onHeatMapToggle}
          className="justify-start"
        >
          <Icon name="Thermometer" size={16} className="mr-2" />
          Heat Map
        </Button>
      </div>

      {/* Drawing Tools */}
      <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-2 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDrawingMenuOpen(!isDrawingMenuOpen)}
          className="justify-start w-full"
        >
          <Icon name="Edit3" size={16} className="mr-2" />
          Drawing Tools
          <Icon name="ChevronDown" size={14} className="ml-auto" />
        </Button>

        {isDrawingMenuOpen && (
          <div className="absolute right-full top-0 mr-2 bg-surface border border-border rounded-lg shadow-elevation-3 p-2 min-w-40">
            <div className="space-y-1">
              {drawingTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={drawingMode === tool.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleDrawingToolSelect(tool.id)}
                  className="justify-start w-full"
                >
                  <Icon name={tool.icon} size={16} className="mr-2" />
                  {tool.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Layer Controls */}
      <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-2">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start"
          title="Layer Settings"
        >
          <Icon name="Layers" size={16} className="mr-2" />
          Layers
        </Button>
      </div>

      {/* Click outside to close drawing menu */}
      {isDrawingMenuOpen && (
        <div 
          className="fixed inset-0 z-999" 
          onClick={() => setIsDrawingMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MapControls;