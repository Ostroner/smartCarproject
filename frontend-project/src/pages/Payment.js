import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Payment() {
  const [payments, setPayments] = useState([]);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ carId: '', amount: '', paymentMethod: 'cash', date: new Date().toISOString().split('T')[0] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, carsRes] = await Promise.all([
        axios.get('/api/payments'),
        axios.get('/api/cars')
      ]);
      setPayments(paymentsRes.data.data || []);
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

    if (!form.carId || !form.amount) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await axios.post('/api/payments', form);
      setForm({ carId: '', amount: '', paymentMethod: 'cash', date: new Date().toISOString().split('T')[0] });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-8">💳 Payments</h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-8 border border-purple-700">
        <h2 className="text-2xl font-bold mb-6 text-purple-100">➕ Record Payment</h2>
        
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
              <label className="block text-purple-300 font-medium mb-2">💰 Amount (Rwf)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Amount"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 font-medium mb-2">💳 Payment Method</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 text-white rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank">Bank Transfer</option>
                <option value="mobile">Mobile Money</option>
              </select>
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            ✅ Record Payment
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">📋 Payment History</h2>
        
        {loading ? (
          <div className="text-center text-purple-300">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="text-center text-purple-300">No payments recorded</div>
        ) : (
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl overflow-hidden border border-purple-700">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-950 border-b border-purple-700">
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Car ID</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Amount (Rwf)</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Method</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-purple-700 hover:bg-purple-800 transition">
                    <td className="px-6 py-4 text-purple-100">{payment.carId}</td>
                    <td className="px-6 py-4 text-green-400 font-bold">{payment.amount?.toLocaleString() || 0} Rwf</td>
                    <td className="px-6 py-4 text-purple-100 capitalize">{payment.paymentMethod}</td>
                    <td className="px-6 py-4 text-purple-100">{payment.date}</td>
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

export default Payment;
