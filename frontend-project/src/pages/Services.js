import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const predefinedServices = [
    { id: 1, name: 'Engine repair', price: 150000 },
    { id: 2, name: 'Transmission repair', price: 80000 },
    { id: 3, name: 'Oil Change', price: 60000 },
    { id: 4, name: 'Chain replacement', price: 40000 },
    { id: 5, name: 'Disc replacement', price: 400000 },
    { id: 6, name: 'Wheel alignment', price: 5000 }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/services');
      setServices(response.data.data || predefinedServices);
      setError('');
    } catch (err) {
      setServices(predefinedServices);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-8">🔧 Services & Prices</h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">💰 Available Services</h2>
        
        {loading ? (
          <div className="text-center text-purple-300">Loading...</div>
        ) : services.length === 0 ? (
          <div className="text-center text-purple-300">No services found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-6 border border-purple-700">
                <h3 className="text-xl font-bold text-purple-100 mb-4">{service.name}</h3>
                <p className="text-3xl font-bold text-green-400">{service.price.toLocaleString()} Rwf</p>
                <div className="mt-4 text-purple-300 text-sm">
                  <p>Service ID: {service.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-8 border border-purple-700">
        <h2 className="text-2xl font-bold mb-6 text-purple-100">📋 Service List</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-950 border-b border-purple-700">
                <th className="px-6 py-4 text-left text-purple-200 font-bold">Service Name</th>
                <th className="px-6 py-4 text-left text-purple-200 font-bold">Price (Rwf)</th>
                <th className="px-6 py-4 text-left text-purple-200 font-bold">ID</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-purple-700 hover:bg-purple-800 transition">
                  <td className="px-6 py-4 text-purple-100 font-medium">{service.name}</td>
                  <td className="px-6 py-4 text-green-400 font-bold">{service.price.toLocaleString()} Rwf</td>
                  <td className="px-6 py-4 text-purple-300">{service.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Services;
