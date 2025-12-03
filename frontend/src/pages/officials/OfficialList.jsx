import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import Table from '../../components/Table';
import { Link, useNavigate } from 'react-router-dom';

export default function OfficialList(){
  const [rows, setRows] = useState([]);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{ 
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');

    // Fetch officials
    (async ()=> {
      try {
        const r = await api.get('/officials');
        setRows(r.data || []);
      } catch (err) { console.error(err) }
    })(); 
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this official?')) return;
    
    try {
      await api.delete(`/officials/${id}`);
      setRows(rows.filter(row => row.id !== id));
      alert('Official deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete official');
    }
  }

  return (
    <div>
      <PageHeader title="Officials & Users" actions={<Link to="/officials/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">Add Official</Link>} />
      <Table columns={[
        { key: 'name', title: 'Name', render: r=>r.name },
        { key: 'position', title: 'Position', render: r=>r.position },
        {
          key: 'actions',
          title: 'Actions',
          render: r => (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/officials/${r.id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                Edit
              </button>
              {userRole === 'admin' && (
                <button
                  onClick={() => handleDelete(r.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                >
                  Delete
                </button>
              )}
            </div>
          )
        }
      ]} data={rows} />
    </div>
  );
}
