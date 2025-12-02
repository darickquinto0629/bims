import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
export default function Layout() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/residents', label: 'Residents', icon: '👥' },
    { path: '/certificates', label: 'Certificates', icon: '📄' },
    { path: '/blotter', label: 'Blotter', icon: '📋' },
    { path: '/officials', label: 'Officials', icon: '👔' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/admin', label: 'Admin', icon: '⚙️' }
  ];
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-2xl font-bold">BIMS</h1>
          <p className="text-blue-100 text-xs mt-1">Barangay Information Management System</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link 
              key={item.path}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-sm font-medium ${
                isActive(item.path) 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
              to={item.path}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
