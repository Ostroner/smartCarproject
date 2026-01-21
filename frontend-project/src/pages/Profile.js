import React, { useState } from 'react';
import axios from 'axios';

function Profile({ user, onLogout }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/change-password', {
        username: user.username,
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        setSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowPasswordForm(false), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-8">👤 Profile</h1>

      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-8 border border-purple-700">
        <h2 className="text-2xl font-bold mb-6 text-purple-100">👥 Account Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-purple-300 font-medium mb-2">Username</label>
            <div className="px-4 py-2 bg-purple-800 border border-purple-600 text-purple-100 rounded-lg">
              {user.username}
            </div>
          </div>

          <div>
            <label className="block text-purple-300 font-medium mb-2">Email</label>
            <div className="px-4 py-2 bg-purple-800 border border-purple-600 text-purple-100 rounded-lg">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-8 border border-purple-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-100">🔐 Security</h2>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {showPasswordForm ? 'Cancel' : '🔑 Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="space-y-6 mt-6 border-t border-purple-700 pt-6">
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
              <label className="block text-purple-300 font-medium mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter current password"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-purple-300 font-medium mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter new password"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-purple-300 font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Confirm new password"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Updating...' : '💾 Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
