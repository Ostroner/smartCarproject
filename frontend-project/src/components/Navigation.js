import React from 'react';
import { Link } from 'react-router-dom';

function Navigation({ user, darkMode, setDarkMode, onLogout }) {
  return (
    <nav className="fixed right-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-950 to-purple-900 text-white shadow-2xl z-50 border-l-2 border-purple-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-purple-700 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-3xl">🅿️</span>
          <span className="text-xl font-bold">ParkingHub</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex-1 overflow-y-auto p-4 space-y-2">
        <li>
          <Link to="/" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition duration-200 font-medium">
            🏠 Customers
          </Link>
        </li>
        <li>
          <Link to="/cars" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition duration-200 font-medium">
            🚗 Cars
          </Link>
        </li>
        <li>
          <Link to="/services" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition duration-200 font-medium">
            🔧 Services
          </Link>
        </li>
        <li>
          <Link to="/service-records" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition duration-200 font-medium">
            📋 Service Records
          </Link>
        </li>
        <li>
          <Link to="/payments" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition duration-200 font-medium">
            💳 Payments
          </Link>
        </li>
        <li>
          <Link to="/reports" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition duration-200 font-medium">
            📊 Reports
          </Link>
        </li>
        <li>
          <Link to="/profile" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition duration-200 font-medium">
            👤 Profile
          </Link>
        </li>
      </ul>

      {/* Footer - User Info & Buttons */}
      <div className="p-4 border-t border-purple-700 space-y-3">
        <div className="px-4 py-3 bg-purple-800 rounded-lg">
          <p className="text-purple-300 text-xs uppercase tracking-wider">Logged in as</p>
          <p className="text-white font-bold text-lg">{user?.username || 'User'}</p>
          <p className="text-purple-200 text-sm">{user?.email}</p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-lg transition duration-200"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        <button
          onClick={onLogout}
          className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg transition duration-200"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
