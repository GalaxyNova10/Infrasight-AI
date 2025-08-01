// frontend/src/Routes.jsx

import React, { Suspense } from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// --- Lazy-loaded Page Imports ---
const HomePage = React.lazy(() => import("pages/home"));
const LoginPage = React.lazy(() => import("pages/login-page"));
const ReportPage = React.lazy(() => import("pages/report-page"));
const MyReportsPage = React.lazy(() => import("pages/my-reports"));
const PublicDataPage = React.lazy(() => import("pages/public-data"));
const MainDashboard = React.lazy(() => import("pages/main-dashboard"));
const InteractiveInfrastructureMap = React.lazy(() => import("pages/interactive-infrastructure-map"));
const AnalyticsDashboard = React.lazy(() => import("pages/analytics-dashboard"));
const VideoFeedMonitoring = React.lazy(() => import("pages/video-feed-monitoring"));
const NotFound = React.lazy(() => import("pages/NotFound"));

// A simple component to show while pages are loading
const LoadingFallback = () => (
  <div style={{ textAlign: 'center', marginTop: '20%' }}>Loading...</div>
);

const ProjectRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/my-reports" element={<MyReportsPage />} />
          <Route path="/public-data" element={<PublicDataPage />} />
          
          {/* Protected Routes (Dashboard) */}
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="/interactive-infrastructure-map" element={<InteractiveInfrastructureMap />} />
          <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
          <Route path="/video-feed-monitoring" element={<VideoFeedMonitoring />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProjectRoutes;