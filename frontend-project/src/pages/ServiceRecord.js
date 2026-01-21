import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ServiceRecord() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ carId: '', serviceId: '', description: '', cost: '', date: new Date().toISOString().split('T')[0] });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsRes, carsRes] = await Promise.all([
        axios.get('/api/service-records'),
        axios.get('/api/cars')
      ]);
      setRecords(recordsRes.data.data || []);
      setCars(carsRes.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.carId || !form.serviceId || !form.cost) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/service-records/${editingId}`, form);
      } else {
        await axios.post('/api/service-records', form);
      }
      setForm({ carId: '', serviceId: '', description: '', cost: '', date: new Date().toISOString().split('T')[0] });
      setEditingId(null);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (record) => {
    setForm(record);
    setEditingId(record.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/service-records/${id}`);
      await fetchData();
    } catch (err) {
      setError('Delete failed');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-8">📋 Service Records</h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-8 border border-purple-700">
        <h2 className="text-2xl font-bold mb-6 text-purple-100">{editingId ? '✏️ Edit Record' : '➕ Add Service Record'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 font-medium mb-2">🚗 Car</label>
              <select
                value={form.carId}
                onChange={(e) => setForm({ ...form, carId: e.target.value })}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Select a car</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.licensePlate} - {car.make} {car.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-purple-300 font-medium mb-2">🔧 Service</label>
              <input
                type="text"
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Service ID or name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 font-medium mb-2">💰 Cost (Rwf)</label>
              <input
                type="number"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Cost"
              />
            </div>
            <div>
              <label className="block text-purple-300 font-medium mb-2">📅 Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-300 font-medium mb-2">📝 Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Service description"
              rows="4"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
            >
              {editingId ? '💾 Update' : '➕ Add Record'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm({ carId: '', serviceId: '', description: '', cost: '', date: new Date().toISOString().split('T')[0] });
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

      <div>
        <h2 className="text-2xl font-bold mb-6">📋 Service Records List</h2>
        
        {loading ? (
          <div className="text-center text-purple-300">Loading...</div>
        ) : records.length === 0 ? (
          <div className="text-center text-purple-300">No records found</div>
        ) : (
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl overflow-hidden border border-purple-700">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-950 border-b border-purple-700">
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Car ID</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Service</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Cost (Rwf)</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Date</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-purple-700 hover:bg-purple-800 transition">
                    <td className="px-6 py-4 text-purple-100">{record.carId}</td>
                    <td className="px-6 py-4 text-purple-100">{record.serviceId}</td>
                    <td className="px-6 py-4 text-green-400 font-bold">{record.cost?.toLocaleString() || 0} Rwf</td>
                    <td className="px-6 py-4 text-purple-100">{record.date}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition duration-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
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

export default ServiceRecord;
