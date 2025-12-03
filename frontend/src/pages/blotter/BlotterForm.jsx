import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function BlotterForm(){
  const navigate = useNavigate();
  const [form, setForm] = useState({ date: '', description: '', reported_by: '', accommodated_by: '' });

  async function submit(e){
    e.preventDefault();
    try {
      await api.post('/blotter', { 
        incident_date: form.date, 
        description: form.description, 
        reported_by: form.reported_by,
        accommodated_by: form.accommodated_by
      });
      alert('Incident recorded');
      navigate('/blotter');
    } catch (err) { console.error(err); alert('Failed'); }
  }

  return (
    <div>
      <PageHeader title="Record Incident" />
      <form className="space-y-4 max-w-2xl" onSubmit={submit}>
        <div>
          <label className="block text-sm">Date</label>
          <input type="date" className="p-2 border rounded" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm">Reported by</label>
          <input className="p-2 border rounded w-full" value={form.reported_by} onChange={e=>setForm({...form, reported_by:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm">Accommodated by (Official/Staff)</label>
          <input className="p-2 border rounded w-full" value={form.accommodated_by} onChange={e=>setForm({...form, accommodated_by:e.target.value})} placeholder="Enter official or staff name" />
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <textarea className="p-2 border rounded w-full" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          <button type="button" onClick={()=>navigate('/blotter')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
