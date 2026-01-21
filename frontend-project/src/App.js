import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Customers from './pages/Customers';
import Profile from './pages/Profile';
import Cars from './pages/Cars';
import Services from './pages/Services';
import ServiceRecord from './pages/ServiceRecord';
import Payment from './pages/Payment';
import Reports from './pages/Reports';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      {user ? (
        <div className="bg-gradient-to-br from-purple-950 via-gray-900 to-purple-950 min-h-screen text-white">
          <Navigation user={user} darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />
          <div className="mr-64 p-8">
            <Routes>
              <Route path="/" element={<Customers />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/services" element={<Services />} />
              <Route path="/service-records" element={<ServiceRecord />} />
              <Route path="/payments" element={<Payment />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
