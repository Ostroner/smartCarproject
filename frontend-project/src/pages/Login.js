import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.success) {
        onLogin(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', { username, email, password });
      if (response.data.success) {
        setSuccess('Registration successful! You can now login.');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setIsRegister(false), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-2xl p-8 border border-purple-700">
          <h1 className="text-3xl font-bold text-center text-white mb-8">🅿️ ParkingHub</h1>
          
          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div>
              <label className="block text-purple-300 font-medium mb-2">👤 Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter username"
                disabled={loading}
                required
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-purple-300 font-medium mb-2">📧 Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter email"
                  disabled={loading}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-purple-300 font-medium mb-2">🔐 Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter password"
                disabled={loading}
                required
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-purple-300 font-medium mb-2">🔐 Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Confirm password"
                  disabled={loading}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-purple-300 text-sm">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                  setSuccess('');
                  setUsername('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-purple-400 hover:text-purple-300 font-bold underline"
              >
                {isRegister ? 'Login here' : 'Register here'}
              </button>
            </p>
          </div>

          {!isRegister && (
            <div className="mt-8 p-4 bg-purple-800 border border-purple-600 rounded-lg">
              <p className="text-purple-300 text-sm font-medium mb-2">📋 Test Credentials:</p>
              <p className="text-purple-200 text-sm">Username: <span className="font-mono font-bold">admin</span></p>
              <p className="text-purple-200 text-sm">Password: <span className="font-mono font-bold">Admin@123</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
