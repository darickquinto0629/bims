import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function OfficialForm(){
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', position: '', term_start: '', term_end: '' });
  const [hasCaptain, setHasCaptain] = useState(false);
  const [currentCaptainId, setCurrentCaptainId] = useState(null);

  useEffect(() => {
    checkExistingCaptain();
    if (id) {
      loadOfficial();
    }
  }, [id]);

  async function checkExistingCaptain() {
    try {
      const response = await api.get('/officials');
      const officials = response.data || [];
      const captain = officials.find(o => o.position === 'Barangay Captain');
      if (captain) {
        setHasCaptain(true);
        setCurrentCaptainId(captain.id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadOfficial() {
    try {
      const response = await api.get(`/officials/${id}`);
      setForm(response.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load official');
    }
  }

  async function submit(e){
    e.preventDefault();
    
    // Validate Barangay Captain position
    if (form.position === 'Barangay Captain' && hasCaptain && currentCaptainId !== parseInt(id)) {
      alert('Barangay Captain position is already assigned to another official. Only one Barangay Captain is allowed.');
      return;
    }

    try {
      if (id) {
        await api.put(`/officials/${id}`, form);
      } else {
        await api.post('/officials', form);
      }
      alert('Saved');
      navigate('/officials');
    } catch (err) { 
      console.error(err); 
      alert('Failed'); 
    }
  }

  return (
    <div>
      <PageHeader title={id ? "Edit Official" : "Add Official"} />
      <form className="space-y-4 max-w-xl" onSubmit={submit}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
          <input 
            name="name" 
            className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
          <select 
            name="position" 
            className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={form.position}
            onChange={e => setForm({...form, position: e.target.value})}
          >
            <option value="">Select Position</option>
            <option 
              value="Barangay Captain" 
              disabled={hasCaptain && currentCaptainId !== parseInt(id)}
            >
              Barangay Captain {hasCaptain && currentCaptainId !== parseInt(id) ? '(Already Assigned)' : ''}
            </option>
            <option value="Barangay Kagawad">Barangay Kagawad</option>
            <option value="Barangay Treasurer">Barangay Treasurer</option>
            <option value="Barangay Secretary">Barangay Secretary</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Term start/end</label>
          <div className="flex gap-2">
            <input 
              name="start" 
              type="date" 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={form.term_start || ''}
              onChange={e => setForm({...form, term_start: e.target.value})}
            />
            <input 
              name="end" 
              type="date" 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={form.term_end || ''}
              onChange={e => setForm({...form, term_end: e.target.value})}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors">Save</button>
          <button type="button" onClick={()=>navigate('/officials')} className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}
