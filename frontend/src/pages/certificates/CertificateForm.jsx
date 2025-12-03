import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

export default function CertificateForm(){
  const [residentQuery, setResidentQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [type, setType] = useState('Barangay Clearance');
  const navigate = useNavigate();
  
  // Form data for the certificate
  const [form, setForm] = useState({
    resident_id: null,
    full_name: '',
    birth_date: '',
    address: '',
    purpose: '',
    issued_by: ''
  });

  // Fetch Barangay Captain for issued_by field
  useEffect(() => {
    async function fetchBarangayCaptain() {
      try {
        const response = await api.get('/officials');
        const officials = response.data;
        const captain = officials.find(official => official.position === 'Barangay Captain');
        if (captain) {
          setForm(prev => ({ ...prev, issued_by: captain.name }));
        }
      } catch (err) {
        console.error('Error fetching Barangay Captain:', err);
      }
    }
    fetchBarangayCaptain();
  }, []);

  // Auto-search as user types
  useEffect(() => {
    if (!residentQuery.trim() || form.resident_id) {
      setSearchResults([]);
      setShowResults(false);
      setSearchError('');
      return;
    }

    const delaySearch = setTimeout(() => {
      searchResident();
    }, 300);
    
    return () => clearTimeout(delaySearch);
  }, [residentQuery]);

  async function searchResident() {
    if (!residentQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setSearchError('');
      return;
    }
    
    setSearchError('');
    
    try {
      const r = await api.get('/residents', { params: { q: residentQuery }});
      const rows = r.data.rows || r.data;
      setSearchResults(rows);
      setShowResults(rows.length > 0);
      
      if (rows.length === 0) {
        setSearchError('Resident not found! Please fill the Certificate Details Manually');
      }
    } catch (err) { 
      console.error(err);
      setSearchResults([]);
      setShowResults(false);
      setSearchError('Resident not found! Please fill the Certificate Details Manually');
    }
  }

  function selectResident(resident) {
    setForm({
      ...form,
      resident_id: resident.id,
      full_name: `${resident.first_name} ${resident.middle_name || ''} ${resident.last_name}`.trim(),
      birth_date: resident.birth_date || '',
      address: resident.Household?.address_line || ''
    });
    setResidentQuery(`${resident.first_name} ${resident.last_name}`);
    setShowResults(false);
    setSearchError('');
  }

  function clearSelection() {
    setForm({
      resident_id: null,
      full_name: '',
      birth_date: '',
      address: '',
      purpose: '',
      issued_by: ''
    });
    setResidentQuery('');
    setSearchResults([]);
    setShowResults(false);
    setSearchError('');
  }

  async function issue() {
    if (!form.full_name || !form.purpose) {
      return alert('Please fill in all required fields');
    }
    
    try {
      await api.post('/certificates', { 
        resident_id: form.resident_id,
        type, 
        issued_by: form.issued_by || 'System',
        purpose: form.purpose
      });
      alert('Certificate issued successfully');
      navigate('/certificates');
    } catch (err) { 
      console.error(err); 
      alert('Failed to issue certificate'); 
    }
  }

  function handlePDFClick() {
    if (!form.full_name || !form.purpose) {
      return alert('Please fill in all required fields before generating PDF');
    }
    setShowPDFModal(true);
  }

  async function confirmGeneratePDF() {
    // First save to database
    try {
      await api.post('/certificates', { 
        resident_id: form.resident_id,
        type, 
        issued_by: form.issued_by || 'System',
        purpose: form.purpose
      });
    } catch (err) {
      console.error(err);
      alert('Failed to save certificate');
      setShowPDFModal(false);
      return;
    }

    // Then generate PDF

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Republic of the Philippines', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Barangay Information Management System', pageWidth / 2, 28, { align: 'center' });
    
    // Certificate Type
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(type.toUpperCase(), pageWidth / 2, 45, { align: 'center' });
    
    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 50, pageWidth - 20, 50);
    
    // Certificate body
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const leftMargin = 25;
    let yPos = 70;
    
    doc.text('TO WHOM IT MAY CONCERN:', leftMargin, yPos);
    yPos += 15;
    
    doc.text('This is to certify that:', leftMargin, yPos);
    yPos += 15;
    
    // Resident details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(form.full_name, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    if (form.birth_date) {
      doc.text(`Date of Birth: ${form.birth_date}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;
    }
    if (form.address) {
      doc.text(`Address: ${form.address}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;
    } else {
      yPos += 10;
    }
    
    // Purpose
    doc.text('is a bonafide resident of this barangay and is requesting', leftMargin, yPos);
    yPos += 8;
    doc.text('this certificate for the following purpose:', leftMargin, yPos);
    yPos += 12;
    
    doc.setFont('helvetica', 'bold');
    const purposeLines = doc.splitTextToSize(form.purpose, pageWidth - 60);
    doc.text(purposeLines, pageWidth / 2, yPos, { align: 'center' });
    yPos += (purposeLines.length * 8) + 15;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Issued this ' + new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), leftMargin, yPos);
    
    // Signature section
    yPos = pageHeight - 60;
    
    doc.setFont('helvetica', 'bold');
    doc.text('_________________________', leftMargin, yPos);
    yPos += 8;
    doc.text(form.issued_by || 'Barangay Official', leftMargin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Authorized Signatory', leftMargin, yPos);
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Not valid without official seal', pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Save the PDF
    const fileName = `${type.replace(/\s+/g, '_')}_${form.full_name.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
    
    setShowPDFModal(false);
    alert('Certificate saved and PDF generated successfully');
    navigate('/certificates');
  }

  return (
    <div>
      <PageHeader title="Issue Certificate" />
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Certificate Type</label>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
            value={type} 
            onChange={e=>setType(e.target.value)}
          >
            <option>Barangay Clearance</option>
            <option>Certificate of Residency</option>
            <option>Certificate of Indigency</option>
            <option>Business Clearance</option>
          </select>
        </div>

        <div className="mb-6 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Resident</label>
          <div className="flex gap-2">
            <input 
              className={`px-4 py-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${searchError ? 'border-red-500 animate-shake' : 'border-gray-300'}`}
              value={residentQuery} 
              onChange={e=>{setResidentQuery(e.target.value); setSearchError('');}}
              onKeyPress={e => e.key === 'Enter' && searchResident()}
              placeholder="Type name to search..." 
            />
            <button 
              onClick={searchResident} 
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            {form.resident_id && (
              <button 
                onClick={clearSelection} 
                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Error Message */}
          {searchError && (
            <div className="mt-2 text-red-600 text-sm font-medium">
              {searchError}
            </div>
          )}
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => selectResident(res)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                >
                  <p className="font-semibold text-gray-900">{res.first_name} {res.last_name}</p>
                  <p className="text-sm text-gray-600">
                    {res.Household?.address_line || 'No address'} | Born: {res.birth_date || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Barangay Clearance Template Form */}
        <div className="border-t border-gray-300 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Certificate Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={form.full_name}
                onChange={e => setForm({...form, full_name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={form.birth_date}
                onChange={e => setForm({...form, birth_date: e.target.value})}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <input
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
              placeholder="Enter complete address"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose *</label>
            <textarea
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={form.purpose}
              onChange={e => setForm({...form, purpose: e.target.value})}
              placeholder="Enter purpose of certificate (e.g., Employment, Business, etc.)"
              rows="3"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Issued By</label>
            <input
              className="px-4 py-2 border border-gray-300 rounded-lg w-full bg-gray-100 cursor-not-allowed focus:outline-none"
              value={form.issued_by}
              readOnly
              placeholder="Loading..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-300">
          <button 
            onClick={handlePDFClick} 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            Generate Certificate
          </button>
          <button 
            onClick={()=>navigate('/certificates')} 
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* PDF Confirmation Modal */}
      {showPDFModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Generate PDF Certificate</h3>
            <p className="text-gray-700 mb-6">
              This will save the certificate and generate a printable PDF file.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowPDFModal(false)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmGeneratePDF}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
