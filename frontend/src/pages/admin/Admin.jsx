import React from 'react';
import PageHeader from '../../components/PageHeader';
import UserManagement from './UserManagement';

export default function Admin() {
  const [activeTab, setActiveTab] = React.useState('users');

  return (
    <div>
      <PageHeader title="System Administration" />

      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 font-semibold transition ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👥 User Management
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-3 font-semibold transition ${
            activeTab === 'settings'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ⚙️ System Settings
        </button>
      </div>

      {activeTab === 'users' && <UserManagement />}

      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">System Settings</h2>
          <p className="text-gray-600">Admin functions: backup, restore, system settings, user roles, audit logs.</p>
          <p className="text-gray-600 mt-2">Use backend endpoints to perform backup/restore and to access activity logs securely.</p>
        </div>
      )}
    </div>
  );
}
