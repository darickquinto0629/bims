import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // User is already logged in, redirect to dashboard
      navigate('/');
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setUsernameError('');
    setPasswordError('');
    setLoading(true);

    try {
      const response = await api.post('/users/login', { username, password });

      // Store token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Update axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg && msg.toLowerCase().includes('username')) {
        setUsernameError(msg);
      } else if (msg && msg.toLowerCase().includes('password')) {
        setPasswordError(msg);
      } else {
        setError(msg || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left brand panel */}
        <div className="hidden md:flex flex-col justify-center items-start gap-6 p-10 bg-gradient-to-b from-blue-700 to-blue-800 text-white">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold">Barangay Information Management System</h2>
            </div>
          </div>

          <div className="mt-4 max-w-xs">
            <h3 className="text-lg font-semibold">Welcome back</h3>
            <p className="text-sm text-blue-100/90 mt-2">Sign in to manage residents, certificates and reports. Only authorized personnel can access the admin functions.</p>
          </div>

          <div className="mt-auto text-sm text-blue-100/80">
            Demo admin: <span className="font-mono">admin</span> / <span className="font-mono">admin123</span>
          </div>
        </div>

        {/* Right form panel */}
        <div className="p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in to BIMS</h1>
            <p className="text-sm text-gray-500 mb-6">Enter your credentials to access the dashboard</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 hidden">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setUsernameError(''); setError(''); }}
                    placeholder="Username"
                    className={`w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-border ${usernameError ? 'border-red-500 animate-shake border' : 'border border-gray-200'}`}
                    required
                  />
                </div>
                {usernameError && <p className="mt-2 text-sm text-red-600">{usernameError}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 hidden">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(''); setError(''); }}
                    placeholder="Password"
                    className={`w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-border ${passwordError ? 'border-red-500 animate-shake border' : 'border border-gray-200'}`}
                    required
                  />
                </div>
                {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow duration-200 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Need help? Contact your system administrator.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

