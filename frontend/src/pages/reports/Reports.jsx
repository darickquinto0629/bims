import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import api from '../../api/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const [demo, setDemo] = useState([]);
  const [monthlyIncidents, setMonthlyIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [demoRes, incidentsRes] = await Promise.all([
          api.get('/reports/resident-demographics'),
          api.get('/reports/monthly-incidents')
        ]);
        setDemo(demoRes.data.gender || []);
        setMonthlyIncidents(incidentsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Chart data for gender demographics
  const genderChartData = {
    labels: demo.map(d => d.gender),
    datasets: [
      {
        label: 'Number of Residents',
        data: demo.map(d => d.count),
        backgroundColor: [
          '#3B82F6', // Blue for Male
          '#EC4899', // Pink for Female
          '#8B5CF6', // Purple for Other
        ],
        borderColor: [
          '#1E40AF',
          '#BE185D',
          '#6D28D9',
        ],
        borderWidth: 2,
      },
    ],
  };

  const genderChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: 'Residents by Gender',
        font: { size: 16, weight: 'bold' },
      },
    },
  };

  // Chart data for monthly incidents
  const monthlyIncidentsData = {
    labels: monthlyIncidents.map(d => {
      const [year, month] = d.month.split('-');
      return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Number of Incidents',
        data: monthlyIncidents.map(d => d.count),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const monthlyIncidentsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: 'Monthly Incident Reports',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div>
      <PageHeader title="Reports & Analytics" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Gender Demographics - Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div style={{ height: '250px', position: 'relative' }}>
            {loading ? (
              <p className="text-gray-500 text-center pt-20">Loading data...</p>
            ) : demo.length > 0 ? (
              <Pie data={genderChartData} options={{ ...genderChartOptions, maintainAspectRatio: false }} />
            ) : (
              <p className="text-gray-500 text-center pt-20">No data available</p>
            )}
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Demographics Summary</h3>
          <div className="space-y-0">
            {demo.length > 0 ? (
              <>
                {demo.map((d, idx) => (
                  <div key={d.gender} className={`flex justify-between items-center py-3 ${idx < demo.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <span className="text-gray-700 font-medium">{d.gender}</span>
                    <span className="text-lg font-bold text-blue-600">{d.count}</span>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold">Total Residents</span>
                    <span className="text-2xl font-bold text-green-600">
                      {demo.reduce((sum, d) => sum + d.count, 0)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        </div>

        {/* Monthly Incidents - Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <div style={{ height: '300px', position: 'relative' }}>
            {loading ? (
              <p className="text-gray-500 text-center pt-20">Loading data...</p>
            ) : monthlyIncidents.length > 0 ? (
              <Line data={monthlyIncidentsData} options={monthlyIncidentsOptions} />
            ) : (
              <p className="text-gray-500 text-center pt-20">No incident data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
