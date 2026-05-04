import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');

  if (!token) {
    // Redirect to sign-in, preserving the intended destination
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If a couple tries to access vendor dashboard (or vice versa), redirect them
  if (role === 'couple' && location.pathname.startsWith('/vendor/')) {
    return <Navigate to="/couple/dashboard" replace />;
  }
  if (role === 'vendor' && location.pathname.startsWith('/couple/')) {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
