import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import Table from '../../components/Table';
import { Link } from 'react-router-dom';

export default function OfficialList(){
  const [rows, setRows] = useState([]);
  useEffect(()=>{ (async ()=> {
    try {
      const r = await api.get('/officials');
      setRows(r.data || []);
    } catch (err) { console.error(err) }
  })(); }, []);
  return (
    <div>
      <PageHeader title="Officials & Users" actions={<Link to="/officials/new" className="px-3 py-2 bg-blue-600 text-white rounded">Add Official / User</Link>} />
      <Table columns={[
        { key: 'name', title: 'Name', render: r=>r.name },
        { key: 'position', title: 'Position', render: r=>r.position }
      ]} data={rows} />
    </div>
  );
}
