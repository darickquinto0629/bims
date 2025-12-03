import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import Table from '../../components/Table';
import { Link } from 'react-router-dom';

export default function BlotterList(){
  const [rows, setRows] = useState([]);
  const [selectedBlotter, setSelectedBlotter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(()=>{ 
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');

    // Fetch blotters
    (async ()=> {
      try {
        const r = await api.get('/blotter');
        setRows(r.data || []);
      } catch (err) { console.error(err) }
    })(); 
  }, []);

  const truncateDescription = (text) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= 20) return text;
    return words.slice(0, 20).join(' ') + '...';
  };

  const handleViewDetails = (blotter) => {
    setSelectedBlotter(blotter);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlotter(null);
  };

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this blotter incident?')) return;
    
    try {
      await api.delete(`/blotter/${id}`);
      setRows(rows.filter(row => row.id !== id));
      alert('Blotter deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete blotter');
    }
  }

  return (
    <div>
      <PageHeader title="Blotter / Incidents" actions={<Link to="/blotter/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">New Incident</Link>} />
      <Table columns={[
        { key: 'incident_date', title: 'Date', render: r=> r.incident_date },
        { 
          key: 'description', 
          title: 'Description', 
          render: r => (
            <span className="text-gray-700">{truncateDescription(r.description)}</span>
          )
        },
        { key: 'reported_by', title: 'Reported By', render: r=> r.reported_by },
        { key: 'accommodated_by', title: 'Accommodated By', render: r=> r.accommodated_by || 'N/A' },
        { 
          key: 'actions', 
          title: 'Actions', 
          render: r => (
            <div className="flex gap-2">
              <button
                onClick={() => handleViewDetails(r)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Read More
              </button>
              {userRole === 'admin' && (
                <button 
                  onClick={() => handleDelete(r.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          )
        }
      ]} data={rows} />

      {/* Blotter Details Modal */}
      {showModal && selectedBlotter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <h3 className="text-2xl font-bold text-white">Incident Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Incident Date</label>
                <p className="text-lg text-gray-900">{selectedBlotter.incident_date}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Reported By</label>
                <p className="text-lg text-gray-900">{selectedBlotter.reported_by || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Accommodated By (Official/Staff)</label>
                <p className="text-lg text-gray-900">{selectedBlotter.accommodated_by || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Description</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {selectedBlotter.description || 'No description provided'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
