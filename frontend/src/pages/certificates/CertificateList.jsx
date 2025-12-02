import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import Table from '../../components/Table';
import { Link } from 'react-router-dom';

export default function CertificateList(){
  const [rows, setRows] = useState([]);
  useEffect(()=>{ (async ()=> {
    try {
      const r = await api.get('/certificates');
      setRows(r.data || []);
    } catch (err) { console.error(err) }
  })(); }, []);
  return (
    <div>
      <PageHeader title="Certificates" actions={<Link className="px-3 py-2 bg-blue-600 text-white rounded" to="/certificates/new">New</Link>} />
      <Table columns={[
        { key: 'type', title: 'Type', render: r=>r.type },
        { key: 'resident', title: 'Resident', render: r=> r.Resident ? `${r.Resident.last_name}, ${r.Resident.first_name}` : '' },
        { key: 'issued_at', title: 'Issued At', render: r=> new Date(r.issued_at).toLocaleString() }
      ]} data={rows} />
    </div>
  );
}
