import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import api from '../../api/api';
import { Link, useNavigate } from 'react-router-dom';

export default function ResidentList(){
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  async function load() {
    try {
      const resp = await api.get('/residents', { params: { q } });
      const data = resp.data.rows || resp.data;
      setRows(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load residents (check backend URL)');
    }
  }

  useEffect(()=>{ load(); }, []);

  const escapeCSVField = (field) => {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExportCSV = () => {
    if (rows.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['id', 'first_name', 'last_name', 'birth_date', 'gender', 'civil_status', 'contact_number', 'email', 'household'];
    const csvLines = [headers.join(',')];
    
    rows.forEach(r => {
      const csvRow = [
        escapeCSVField(r.id),
        escapeCSVField(r.first_name),
        escapeCSVField(r.last_name),
        escapeCSVField(r.birth_date),
        escapeCSVField(r.gender),
        escapeCSVField(r.civil_status),
        escapeCSVField(r.contact_number),
        escapeCSVField(r.email),
        escapeCSVField(r.Household?.household_code || '')
      ];
      csvLines.push(csvRow.join(','));
    });

    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `residents_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <PageHeader title="Residents" actions={<div className="flex items-center gap-2"><Link className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors" to="/residents/new">+ Add Resident</Link>
      {q ? (
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
        >
          Export Search Results
        </button>
      ) : (
        <a
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors"
          href={`${import.meta.env.VITE_API_URL}/residents/export?q=${encodeURIComponent(q)}`}
        >
          Export All
        </a>
      )}
      </div>} />
      <div className="mb-6 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
        <button onClick={load} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow duration-200">Search</button>
      </div>
      <Table
        columns={[
          { key: 'name', title: 'Name', render: r => `${r.last_name}, ${r.first_name}` },
          { key: 'household', title: 'Household', render: r => r.Household?.household_code ?? '' },
          { key: 'actions', title: 'Actions', render: r => <div><button onClick={()=>navigate(`/residents/${r.id}/edit`)} className="text-blue-600">Edit</button></div> }
        ]}
        data={rows}
      />
    </div>
  );
}
