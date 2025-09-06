import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Map', path: '/dashboard/interactive-infrastructure-map' },
    { name: 'Analytics', path: '/dashboard/analytics-dashboard' },
    { name: 'Video Feeds', path: '/dashboard/video-feed-monitoring' },
    
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between h-20 px-6">
        <Link to="/" className="text-2xl font-extrabold text-gray-900 tracking-tight">
          InfraSight AI
        </Link>
        <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `relative text-lg font-medium transition-colors duration-200 ease-in-out
                ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}`
              }
            >
              {item.name}
            </NavLink>
          ))}
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{user.role}</span>
              <button onClick={logout} className="text-sm text-primary hover:underline">
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;