import React from 'react';
import PageHeader from '../../components/PageHeader';

export default function Admin(){
  return (
    <div>
      <PageHeader title="System Administration" />
      <div className="bg-white p-4 rounded shadow">
        <p>Admin functions: backup, restore, system settings, user roles, audit logs. Use backend endpoints to perform backup/restore and to access activity logs securely.</p>
      </div>
    </div>
  );
}
