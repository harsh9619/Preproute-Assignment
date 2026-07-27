import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store';

// Containers/Pages imports
import LoginPage from '../containers/auth/LoginPage';
import DashboardPage from '../containers/tests/DashboardPage';
import CreateTestPage from '../containers/tests/CreateTestPage';
import AddQuestionsPage from '../containers/tests/AddQuestionsPage';
import PreviewPublishPage from '../containers/tests/PreviewPublishPage';


// Components imports
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/header/Header';

interface RouteWrapperProps {
  children: React.ReactNode;
}

// Protected Route Wrapper
const ProtectedRoute: React.FC<RouteWrapperProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#070a13' }}>
        <div className="pulse-glow" style={{ padding: '2rem', borderRadius: '12px', background: '#0f1423' }}>
          Loading session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Layout Wrapper
const Layout: React.FC<RouteWrapperProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};


export const AppRouter: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-test"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateTestPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-test/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateTestPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/test/:id/questions"
          element={
            <ProtectedRoute>
              <Layout>
                <AddQuestionsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/test/:id/preview"
          element={
            <ProtectedRoute>
              <Layout>
                <PreviewPublishPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
