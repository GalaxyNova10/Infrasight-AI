import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const PublicHomeHeader = () => {
  const navItems = [
    { name: 'Community', path: '/community' },
    { name: 'Report', path: '/report' },
    { name: 'My Reports', path: '/my-reports' },
    { name: 'Login/Register', path: '/login' },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <nav className="container mx-auto flex items-center justify-between h-20 px-6">
        <Link to="/" className="text-2xl font-extrabold text-gray-900 tracking-tight">
          InfraSight AI
        </Link>
        <div className="flex items-center space-x-6">
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative text-lg font-medium transition-all duration-300 ease-in-out
                  ${isActive ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}
                  after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-red-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`
                }
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default PublicHomeHeader;