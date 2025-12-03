import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import api from './api/api';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ResidentList from './pages/residents/ResidentList';
import ResidentForm from './pages/residents/ResidentForm';
import HouseholdList from './pages/households/HouseholdList';
import HouseholdForm from './pages/households/HouseholdForm';
import CertificateList from './pages/certificates/CertificateList';
import CertificateForm from './pages/certificates/CertificateForm';
import BlotterList from './pages/blotter/BlotterList';
import BlotterForm from './pages/blotter/BlotterForm';
import OfficialList from './pages/officials/OfficialList';
import OfficialForm from './pages/officials/OfficialForm';
import Reports from './pages/reports/Reports';
import Admin from './pages/admin/Admin';

export default function App(){
  useEffect(() => {
    // Set up axios interceptor to include token in all requests
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/residents" element={<ResidentList />} />
        <Route path="/residents/new" element={<ResidentForm />} />
        <Route path="/residents/:id/edit" element={<ResidentForm />} />

        <Route path="/households" element={<HouseholdList />} />
        <Route path="/households/add" element={<HouseholdForm />} />
        <Route path="/households/:id" element={<HouseholdForm />} />

        <Route path="/certificates" element={<CertificateList />} />
        <Route path="/certificates/new" element={<CertificateForm />} />

        <Route path="/blotter" element={<BlotterList />} />
        <Route path="/blotter/new" element={<BlotterForm />} />

        <Route path="/officials" element={<OfficialList />} />
        <Route path="/officials/new" element={<OfficialForm />} />
        <Route path="/officials/:id/edit" element={<OfficialForm />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/admin" element={<Admin />} />
      </Route>

      {/* Redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
