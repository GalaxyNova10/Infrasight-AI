import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PublicHeader = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const publicNavItems = [
    {
      label: 'Home',
      path: '/',
      icon: 'Home'
    },
    {
      label: 'Report Issue',
      path: '/report-issue',
      icon: 'AlertTriangle'
    },
    {
      label: 'Community',
      path: '/community',
      icon: 'Users'
    },
    {
      label: 'About',
      path: '/about',
      icon: 'Info'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-royal-red rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900">InfraSight AI</span>
                <span className="text-xs text-gray-500">Citizen Portal</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-royal-red text-white'
                    : 'text-gray-600 hover:text-royal-red hover:bg-red-50'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost" iconName="LogIn" iconPosition="left">
                Sign In
              </Button>
            </Link>
            <Link to="/citizen-registration">
              <Button iconName="UserPlus" iconPosition="left" className="bg-royal-red text-white hover:bg-royal-red/90">
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-slide-in">
            <nav className="p-4 space-y-2">
              {publicNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-royal-red text-white'
                      : 'text-gray-600 hover:text-royal-red hover:bg-red-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link to="/login" className="block">
                  <Button variant="ghost" fullWidth iconName="LogIn" iconPosition="left">
                    Sign In
                  </Button>
                </Link>
                <Link to="/citizen-registration" className="block">
                  <Button fullWidth iconName="UserPlus" iconPosition="left" className="bg-royal-red text-white hover:bg-royal-red/90">
                    Register
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;