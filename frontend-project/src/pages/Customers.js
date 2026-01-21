import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/customers');
      setCustomers(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/customers/${editingId}`, form);
      } else {
        await axios.post('/api/customers', form);
      }
      setForm({ name: '', email: '', phone: '', address: '' });
      setEditingId(null);
      await fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditingId(customer.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/customers/${id}`);
      await fetchCustomers();
    } catch (err) {
      setError('Delete failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-8">👥 Customers</h1>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-8 border border-purple-700">
          <h2 className="text-2xl font-bold mb-6 text-purple-100">{editingId ? '✏️ Edit Customer' : '➕ Add New Customer'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-medium mb-2">👤 Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-medium mb-2">📧 Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-medium mb-2">📞 Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-medium mb-2">📍 Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Address"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
              >
                {editingId ? '💾 Update' : '➕ Add Customer'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: '', email: '', phone: '', address: '' });
                    setEditingId(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">📋 Customer List</h2>
        
        {loading ? (
          <div className="text-center text-purple-300">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="text-center text-purple-300">No customers found</div>
        ) : (
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl overflow-hidden border border-purple-700">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-950 border-b border-purple-700">
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Name</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Email</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Phone</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Address</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-purple-700 hover:bg-purple-800 transition">
                    <td className="px-6 py-4 text-purple-100">{customer.name}</td>
                    <td className="px-6 py-4 text-purple-100">{customer.email}</td>
                    <td className="px-6 py-4 text-purple-100">{customer.phone}</td>
                    <td className="px-6 py-4 text-purple-100">{customer.address}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition duration-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-200"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
