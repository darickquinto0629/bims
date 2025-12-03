import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import api from '../api/api';

export default function Dashboard(){
  const [summary, setSummary] = useState({ residents: 0, certificates: 0, incidents: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get('/reports/summary');
        if (resp && resp.data) setSummary(resp.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const cards = [
    { label: 'Total Residents', value: summary.residents, icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Certificates Issued', value: summary.certificates, icon: '📄', color: 'from-green-500 to-green-600' },
    { label: 'Incidents Reported', value: summary.incidents, icon: '⚠️', color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            onClick={() => {
              if (idx === 0) navigate('/residents');
              else if (idx === 1) navigate('/certificates');
              else if (idx === 2) navigate('/blotter');
            }}
            className={`bg-gradient-to-br ${card.color} text-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200 ${(idx === 0 || idx === 1 || idx === 2) ? 'cursor-pointer' : ''}`}
          >
            <div className="p-6 flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">{card.label}</p>
                <p className="text-4xl font-bold mt-2">{loading ? '—' : card.value ?? '0'}</p>
              </div>
              <div className="text-5xl opacity-20">{card.icon}</div>
            </div>
            <div className="h-1 bg-white opacity-30"></div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-900">System Name</p>
            <p>Barangay Information Management System</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Version</p>
            <p>1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
