import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ResidentList from './pages/residents/ResidentList';
import ResidentForm from './pages/residents/ResidentForm';
import CertificateList from './pages/certificates/CertificateList';
import CertificateForm from './pages/certificates/CertificateForm';
import BlotterList from './pages/blotter/BlotterList';
import BlotterForm from './pages/blotter/BlotterForm';
import OfficialList from './pages/officials/OfficialList';
import OfficialForm from './pages/officials/OfficialForm';
import Reports from './pages/reports/Reports';
import Admin from './pages/admin/Admin';

export default function App(){
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/residents" element={<ResidentList />} />
        <Route path="/residents/new" element={<ResidentForm />} />
        <Route path="/residents/:id/edit" element={<ResidentForm />} />

        <Route path="/certificates" element={<CertificateList />} />
        <Route path="/certificates/new" element={<CertificateForm />} />

        <Route path="/blotter" element={<BlotterList />} />
        <Route path="/blotter/new" element={<BlotterForm />} />

        <Route path="/officials" element={<OfficialList />} />
        <Route path="/officials/new" element={<OfficialForm />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
