import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  
  // Define breadcrumb mappings for each route
  const breadcrumbMap = {
    '/main-dashboard': [
      { label: 'Dashboard', path: '/main-dashboard' }
    ],
    '/video-feed-monitoring': [
      { label: 'Dashboard', path: '/main-dashboard' },
      { label: 'Video Monitoring', path: '/video-feed-monitoring' }
    ],
    '/interactive-infrastructure-map': [
      { label: 'Dashboard', path: '/main-dashboard' },
      { label: 'Infrastructure Map', path: '/interactive-infrastructure-map' }
    ],
    '/analytics-dashboard': [
      { label: 'Dashboard', path: '/main-dashboard' },
      { label: 'Analytics', path: '/analytics-dashboard' }
    ],
    '/login': [
      { label: 'Login', path: '/login' }
    ],
    '/citizen-registration': [
      { label: 'Citizen Registration', path: '/citizen-registration' }
    ]
  };

  const currentBreadcrumbs = breadcrumbMap[location.pathname] || [];

  // Don't show breadcrumbs on login or registration pages
  if (['/login', '/citizen-registration'].includes(location.pathname)) {
    return null;
  }

  // Don't show breadcrumbs if there's only one item (current page)
  if (currentBreadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      <Icon name="Home" size={16} className="text-text-secondary" />
      
      {currentBreadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-text-secondary" />
          )}
          
          {index === currentBreadcrumbs.length - 1 ? (
            // Current page - not clickable
            <span className="font-medium text-text-primary" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            // Previous pages - clickable
            <Link
              to={crumb.path}
              className="hover:text-text-primary transition-smooth"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;