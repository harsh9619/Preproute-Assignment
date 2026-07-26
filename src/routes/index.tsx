import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store';

// Containers/Pages imports
import LoginPage from '../containers/auth/LoginPage';

// Components imports
import Navbar from '../components/navbar/Navbar';

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
  return (
    <div className="app-container">
      <Navbar />
      <main className="content-wrapper">{children}</main>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
       

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
