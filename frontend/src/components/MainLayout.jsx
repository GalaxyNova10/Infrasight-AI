import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './ui/Header';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header user={user} />
      <main className="p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;