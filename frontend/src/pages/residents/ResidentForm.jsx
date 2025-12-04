import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function ResidentForm(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [households, setHouseholds] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    household_id: '', address: '', first_name: '', middle_name: '', last_name: '', birth_date: '', gender: 'Male', civil_status: 'Single', occupation: '', contact_number: '', email: ''
  });

  useEffect(()=>{
    (async ()=> {
      try {
        const hh = await api.get('/households');
        setHouseholds(hh.data || []);
        if (id) {
          const r = await api.get(`/residents/${id}`);
          setForm({ ...form, ...r.data });
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load data');
      }
    })();
  }, [id]);

  async function submit(e){
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.household_id) {
      setError('You need to select a household');
      setLoading(false);
      return;
    }

    if (!form.first_name || !form.last_name) {
      setError('First name and last name are required');
      setLoading(false);
      return;
    }

    if (!form.address) {
      setError('Address is required');
      setLoading(false);
      return;
    }

    try {
      if (id) await api.put(`/residents/${id}`, form);
      else await api.post('/residents', form);
      navigate('/residents');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save resident');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title={id ? 'Edit Resident' : 'Add Resident'} />
      {error && (
        <div className='mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300'>
          {error}
        </div>
      )}
      <form className='space-y-6 max-w-2xl bg-white p-8 rounded-lg shadow-md' onSubmit={submit}>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Household</label>
          <select value={form.household_id || ''} onChange={e=>setForm({...form, household_id: e.target.value||null})} className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'>
            <option value=''>-- Select Household --</option>
            {households.map(h=> <option key={h.id} value={h.id}>{h.household_code}</option>)}
          </select>
        </div>

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Address *</label>
          <input required className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' value={form.address || ''} onChange={e=>setForm({...form, address: e.target.value})} placeholder='Enter complete address' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>First Name *</label>
            <input required className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})}/>
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Last Name *</label>
            <input required className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})}/>
          </div>
        </div>

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Birth Date</label>
          <input type='date' className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' value={form.birth_date||''} onChange={e=>setForm({...form, birth_date:e.target.value})}/>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Gender</label>
            <select className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Civil Status</label>
            <select className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' value={form.civil_status} onChange={(e) => setForm({ ...form, civil_status: e.target.value })}>
              <option value='Single'>Single</option>
              <option value='Married'>Married</option>
              <option value='Widowed'>Widowed</option>
              <option value='Separated'>Separated</option>
              <option value='Divorced'>Divorced</option>
              <option value='Other'>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Occupation</label>
          <input className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} placeholder='Enter occupation' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Contact Number</label>
            <input className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} placeholder='09XXXXXXXXX' />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Email</label>
            <input className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' value={form.email} type='email' onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder='email@example.com' />
          </div>
        </div>

        <div className='flex gap-3 pt-4'>
          <button disabled={loading} className='px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow duration-200 disabled:opacity-50'>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type='button' onClick={()=>navigate('/residents')} className='px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200'>Cancel</button>
        </div>
      </form>
    </div>
  );
}
