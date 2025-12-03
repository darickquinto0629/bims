import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/residents', label: 'Residents', icon: '👥' },
    { path: '/households', label: 'Households', icon: '🏠' },
    { path: '/certificates', label: 'Certificates', icon: '📄' },
    { path: '/blotter', label: 'Blotter', icon: '📋' },
    { path: '/officials', label: 'Officials', icon: '👔' },
    { path: '/reports', label: 'Reports', icon: '📈' }
  ];

  // Only show admin menu when user is admin
  if (user && user.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-2xl font-bold">BIMS</h1>
          <p className="text-blue-100 text-xs mt-1">Barangay Information Management System</p>
          {user && (
            <div className="mt-4 pt-4 border-t border-blue-500">
              <p className="text-blue-100 text-xs">Logged in as</p>
              <p className="text-white text-sm font-semibold">
                {user.full_name || user.username} <span className="text-blue-200 font-normal lowercase">({user.role})</span>
              </p>
            </div>
          )}
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
        
        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold flex items-center justify-center gap-2"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto pb-20">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

