// frontend/src/Routes.jsx

import React, { Suspense } from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./components/MainLayout";
import PublicLayout from "./components/PublicLayout"; // Import the new PublicLayout

// --- Lazy-loaded Page Imports ---
const HomePage = React.lazy(() => import("./pages/home"));
const LoginPage = React.lazy(() => import("./pages/login-page"));
const RegisterPage = React.lazy(() => import("./pages/register"));
const ReportPage = React.lazy(() => import("./pages/report-page"));
const MyReportsPage = React.lazy(() => import("./pages/my-reports"));
const PublicDataPage = React.lazy(() => import("./pages/public-data"));
const CommunityPage = React.lazy(() => import("./pages/community-hub"));
const MainDashboard = React.lazy(() => import("./pages/main-dashboard"));
const InteractiveInfrastructureMap = React.lazy(() => import("./pages/interactive-infrastructure-map"));
const AnalyticsDashboard = React.lazy(() => import("./pages/analytics-dashboard"));
const VideoFeedMonitoring = React.lazy(() => import("./pages/video-feed-monitoring"));
const ForgotPasswordPage = React.lazy(() => import("./pages/forgot-password"));
const ResetPasswordPage = React.lazy(() => import("./pages/reset-password"));
const TestingPage = React.lazy(() => import("./pages/testing"));
const UsersPage = React.lazy(() => import("./pages/users"));
const ReportsPage = React.lazy(() => import("./pages/reports"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

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
          {/* Public Routes with PublicLayout */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="public-data" element={<PublicDataPage />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="my-reports" element={<MyReportsPage />} />
          </Route>

          {/* Routes with MainLayout (Dashboard) */}
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<MainDashboard />} />
            <Route path="interactive-infrastructure-map" element={<InteractiveInfrastructureMap />} />
            <Route path="analytics-dashboard" element={<AnalyticsDashboard />} />
            <Route path="video-feed-monitoring" element={<VideoFeedMonitoring />} />
            <Route path="testing" element={<TestingPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* Standalone Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProjectRoutes;