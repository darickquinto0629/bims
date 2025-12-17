import React from 'react';
import { Navigate } from 'react-router-dom';

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    const decoded = decodeToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
