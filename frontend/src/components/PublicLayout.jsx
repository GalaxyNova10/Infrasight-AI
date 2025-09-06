import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHomeHeader from './PublicHomeHeader';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicHomeHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;