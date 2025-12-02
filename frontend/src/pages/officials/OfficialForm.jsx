import React from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function OfficialForm(){
  const navigate = useNavigate();
  async function submit(e){
    e.preventDefault();
    const form = { name: e.target.name.value, position: e.target.position.value, term_start: e.target.start.value, term_end: e.target.end.value };
    try {
      await api.post('/officials', form);
      alert('Saved');
      navigate('/officials');
    } catch (err) { console.error(err); alert('Failed'); }
  }
  return (
    <div>
      <PageHeader title="Add / Edit Official" />
      <form className="space-y-4 max-w-xl" onSubmit={submit}>
        <div>
          <label className="block text-sm">Name</label>
          <input name="name" className="p-2 border rounded w-full" />
        </div>
        <div>
          <label className="block text-sm">Position</label>
          <input name="position" className="p-2 border rounded w-full" />
        </div>
        <div>
          <label className="block text-sm">Term start/end</label>
          <div className="flex gap-2">
            <input name="start" type="date" className="p-2 border rounded" />
            <input name="end" type="date" className="p-2 border rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          <button type="button" onClick={()=>navigate('/officials')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
