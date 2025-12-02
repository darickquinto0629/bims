import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function CertificateForm(){
  const [residentQuery, setResidentQuery] = useState('');
  const [resident, setResident] = useState(null);
  const [type, setType] = useState('Barangay Clearance');
  const navigate = useNavigate();

  async function searchResident() {
    try {
      const r = await api.get('/residents', { params: { q: residentQuery }});
      const rows = r.data.rows || r.data;
      setResident(rows[0] || null);
    } catch (err) { console.error(err) }
  }

  async function issue() {
    if (!resident) return alert('Select a resident first');
    try {
      await api.post('/certificates', { resident_id: resident.id, type, issued_by: 'System' });
      alert('Certificate issued');
      navigate('/certificates');
    } catch (err) { console.error(err); alert('Failed'); }
  }

  return (
    <div>
      <PageHeader title="Issue Certificate" />
      <div className="bg-white p-4 rounded shadow max-w-xl">
        <div className="mb-3">
          <label className="block text-sm">Certificate Type</label>
          <select className="p-2 border rounded w-full" value={type} onChange={e=>setType(e.target.value)}>
            <option>Barangay Clearance</option>
            <option>Certificate of Residency</option>
            <option>Certificate of Indigency</option>
            <option>Business Clearance</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm">Search Resident</label>
          <div className="flex gap-2">
            <input className="p-2 border rounded flex-1" value={residentQuery} onChange={e=>setResidentQuery(e.target.value)} placeholder="Type name..." />
            <button onClick={searchResident} className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
          </div>
          {resident && <div className="mt-2 p-2 border rounded bg-gray-50">{resident.first_name} {resident.last_name}</div>}
        </div>

        <div className="flex gap-2">
          <button onClick={issue} className="px-4 py-2 bg-green-600 text-white rounded">Generate</button>
          <button onClick={()=>navigate('/certificates')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
