import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';

export default function Reports(){
  const [demo, setDemo] = useState([]);
  useEffect(()=>{ (async ()=> {
    try {
      const r = await api.get('/reports/resident-demographics');
      setDemo(r.data.gender || []);
    } catch (err) { console.error(err) }
  })(); }, []);
  return (
    <div>
      <PageHeader title="Reports & Analytics" />
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Resident Demographics (by gender)</h3>
        <ul>
          {demo.map(d=> <li key={d.gender}>{d.gender}: {d.count}</li>)}
        </ul>
      </div>
    </div>
  );
}
