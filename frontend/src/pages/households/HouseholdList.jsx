import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import api from '../../api/api';

export default function HouseholdList() {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');
    
    fetchHouseholds();
  }, []);

  async function fetchHouseholds() {
    setLoading(true);
    try {
      const response = await api.get('/households');
      setHouseholds(response.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load households');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteHousehold(id) {
    console.log('Delete household with id:', id);
    if (window.confirm('Are you sure you want to delete this household?')) {
      try {
        console.log('Sending delete request to /households/' + id);
        await api.delete(`/households/${id}`);
        console.log('Household deleted successfully');
        setHouseholds(households.filter(h => h.id !== id));
      } catch (err) {
        console.error('Error deleting household:', err);
        setError(err.response?.data?.message || 'Failed to delete household');
      }
    }
  }

  const columns = [
    { key: 'household_code', title: 'Household Code' },
    {
      key: 'actions',
      title: 'Actions',
      render: (household) => (
        <div className='flex gap-2'>
          <button
            onClick={() => navigate(`/households/${household.id}`)}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold'
          >
            Edit
          </button>
          {userRole === 'admin' && (
            <button
              onClick={() => deleteHousehold(household.id)}
              className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold'
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <PageHeader title='Households' />
        <button
          onClick={() => navigate('/households/add')}
          className='px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow duration-200'
        >
          + Add Household
        </button>
      </div>

      {error && (
        <div className='mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300'>
          {error}
        </div>
      )}

      <Table columns={columns} data={households} loading={loading} />
    </div>
  );
}
