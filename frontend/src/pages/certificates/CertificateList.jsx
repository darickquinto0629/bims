import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import Table from '../../components/Table';
import { Link } from 'react-router-dom';

export default function CertificateList(){
  const [rows, setRows] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(()=>{ 
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');

    // Fetch certificates
    (async ()=> {
      try {
        const r = await api.get('/certificates');
        setRows(r.data || []);
      } catch (err) { console.error(err) }
    })(); 
  }, []);

  function handleViewDetails(certificate) {
    setSelectedCertificate(certificate);
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      await api.delete(`/certificates/${id}`);
      setRows(rows.filter(row => row.id !== id));
      alert('Certificate deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete certificate');
    }
  }

  return (
    <div>
      <PageHeader title="Certificates" actions={<Link className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors" to="/certificates/new">New Certificate</Link>} />
      <Table columns={[
        { key: 'type', title: 'Type', render: r=>r.type },
        { key: 'resident', title: 'Resident', render: r=> r.Resident ? `${r.Resident.last_name}, ${r.Resident.first_name}` : 'N/A' },
        { key: 'purpose', title: 'Purpose', render: r=> r.purpose || 'N/A' },
        { key: 'issued_by', title: 'Issued By', render: r=> r.issued_by || 'N/A' },
        { key: 'issued_at', title: 'Issued At', render: r=> new Date(r.issued_at).toLocaleString() },
        { 
          key: 'actions', 
          title: 'Actions', 
          render: r => (
            <div className="flex gap-2">
              <button 
                onClick={() => handleViewDetails(r)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View
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

      {/* Certificate Details Modal */}
      {showModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Certificate Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Certificate Type</label>
                <p className="text-lg text-gray-900">{selectedCertificate.type}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Resident Name</label>
                <p className="text-lg text-gray-900">
                  {selectedCertificate.Resident 
                    ? `${selectedCertificate.Resident.first_name} ${selectedCertificate.Resident.middle_name || ''} ${selectedCertificate.Resident.last_name}`.trim()
                    : 'N/A'}
                </p>
              </div>

              {selectedCertificate.Resident?.birth_date && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
                  <p className="text-lg text-gray-900">{selectedCertificate.Resident.birth_date}</p>
                </div>
              )}

              {selectedCertificate.Resident?.Household?.address_line && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
                  <p className="text-lg text-gray-900">{selectedCertificate.Resident.Household.address_line}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Purpose</label>
                <p className="text-lg text-gray-900 whitespace-pre-wrap">{selectedCertificate.purpose || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Issued By</label>
                <p className="text-lg text-gray-900">{selectedCertificate.issued_by || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Issued At</label>
                <p className="text-lg text-gray-900">{new Date(selectedCertificate.issued_at).toLocaleString()}</p>
              </div>

              {selectedCertificate.remarks && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Remarks</label>
                  <p className="text-lg text-gray-900 whitespace-pre-wrap">{selectedCertificate.remarks}</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
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
