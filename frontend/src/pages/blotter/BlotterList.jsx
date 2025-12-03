import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import Table from '../../components/Table';
import { Link } from 'react-router-dom';

export default function BlotterList(){
  const [rows, setRows] = useState([]);
  const [selectedBlotter, setSelectedBlotter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(()=>{ (async ()=> {
    try {
      const r = await api.get('/blotter');
      setRows(r.data || []);
    } catch (err) { console.error(err) }
  })(); }, []);

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

  return (
    <div>
      <PageHeader title="Blotter / Incidents" actions={<Link to="/blotter/new" className="px-3 py-2 bg-blue-600 text-white rounded">New Incident</Link>} />
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
            <button
              onClick={() => handleViewDetails(r)}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Read More
            </button>
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
