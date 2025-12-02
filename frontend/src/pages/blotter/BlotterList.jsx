import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import Table from '../../components/Table';
import { Link } from 'react-router-dom';

export default function BlotterList(){
  const [rows, setRows] = useState([]);
  useEffect(()=>{ (async ()=> {
    try {
      const r = await api.get('/blotter');
      setRows(r.data || []);
    } catch (err) { console.error(err) }
  })(); }, []);
  return (
    <div>
      <PageHeader title="Blotter / Incidents" actions={<Link to="/blotter/new" className="px-3 py-2 bg-blue-600 text-white rounded">New Incident</Link>} />
      <Table columns={[
        { key: 'incident_date', title: 'Date', render: r=> r.incident_date },
        { key: 'desc', title: 'Description', render: r=> r.description },
        { key: 'reported_by', title: 'Reported By', render: r=> r.reported_by }
      ]} data={rows} />
    </div>
  );
}
