import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        await axiosClient.get('/admin/me');
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    verifyAdmin();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/super/admin" replace />;
}