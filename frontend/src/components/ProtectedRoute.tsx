import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    // If not logged in, redirect to login page
    return <Navigate to="/auth" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // If roles are specified and user's role is not in the list, redirect to home
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    // In case of parsing error, clear cache and prompt login
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/auth" replace />;
  }
};

export default ProtectedRoute;
