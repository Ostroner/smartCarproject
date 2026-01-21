import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cars() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ licensePlate: '', make: '', model: '', year: '', ownerName: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cars');
      setCars(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.licensePlate || !form.make || !form.model) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/cars/${editingId}`, form);
      } else {
        await axios.post('/api/cars', form);
      }
      setForm({ licensePlate: '', make: '', model: '', year: '', ownerName: '' });
      setEditingId(null);
      await fetchCars();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (car) => {
    setForm(car);
    setEditingId(car.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/cars/${id}`);
      await fetchCars();
    } catch (err) {
      setError('Delete failed');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-8">🚗 Cars</h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-8 border border-purple-700">
        <h2 className="text-2xl font-bold mb-6 text-purple-100">{editingId ? '✏️ Edit Car' : '➕ Add New Car'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 font-medium mb-2">📋 License Plate</label>
              <input
                type="text"
                value={form.licensePlate}
                onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g. RAJ-001"
              />
            </div>
            <div>
              <label className="block text-purple-300 font-medium mb-2">🏭 Make</label>
              <input
                type="text"
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g. Toyota"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 font-medium mb-2">🚙 Model</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g. Camry"
              />
            </div>
            <div>
              <label className="block text-purple-300 font-medium mb-2">📅 Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g. 2020"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-300 font-medium mb-2">👤 Owner Name</label>
            <input
              type="text"
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Owner name"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
            >
              {editingId ? '💾 Update' : '➕ Add Car'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm({ licensePlate: '', make: '', model: '', year: '', ownerName: '' });
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
        <h2 className="text-2xl font-bold mb-6">📋 Car List</h2>
        
        {loading ? (
          <div className="text-center text-purple-300">Loading...</div>
        ) : cars.length === 0 ? (
          <div className="text-center text-purple-300">No cars found</div>
        ) : (
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl overflow-hidden border border-purple-700">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-950 border-b border-purple-700">
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">License Plate</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Make</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Model</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Year</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Owner</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className="border-b border-purple-700 hover:bg-purple-800 transition">
                    <td className="px-6 py-4 text-purple-100">{car.licensePlate}</td>
                    <td className="px-6 py-4 text-purple-100">{car.make}</td>
                    <td className="px-6 py-4 text-purple-100">{car.model}</td>
                    <td className="px-6 py-4 text-purple-100">{car.year}</td>
                    <td className="px-6 py-4 text-purple-100">{car.ownerName}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(car)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition duration-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
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

export default Cars;
