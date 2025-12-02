import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function HouseholdForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    household_code: '',
    address_line: ''
  });

  useEffect(() => {
    console.log('HouseholdForm mounted with id:', id);
    if (id) {
      (async () => {
        try {
          console.log('Fetching household with id:', id);
          const response = await api.get(`/households/${id}`);
          console.log('Household fetched:', response.data);
          setForm(response.data);
        } catch (err) {
          console.error('Error fetching household:', err);
          setError(err.response?.data?.message || 'Failed to load household');
        }
      })();
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.household_code || !form.address_line) {
      setError('Household code and address are required');
      setLoading(false);
      return;
    }

    try {
      if (id) {
        await api.put(`/households/${id}`, form);
      } else {
        await api.post('/households', form);
      }
      navigate('/households');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save household');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title={id ? 'Edit Household' : 'Add Household'} />
      {error && (
        <div className='mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300'>
          {error}
        </div>
      )}
      <form className='space-y-6 max-w-2xl bg-white p-8 rounded-lg shadow-md' onSubmit={handleSubmit}>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Household Code *</label>
          <input
            required
            className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
            value={form.household_code}
            onChange={e => setForm({ ...form, household_code: e.target.value })}
            placeholder='e.g., HH001'
          />
        </div>

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Address Line *</label>
          <input
            required
            className='px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
            value={form.address_line}
            onChange={e => setForm({ ...form, address_line: e.target.value })}
            placeholder='e.g., 123 Main Street'
          />
        </div>

        <div className='flex gap-3 pt-4'>
          <button
            disabled={loading}
            className='px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow duration-200 disabled:opacity-50'
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/households')}
            className='px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
