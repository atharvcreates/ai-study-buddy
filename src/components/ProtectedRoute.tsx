import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);

  if (!user && !localStorage.getItem('user')) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
