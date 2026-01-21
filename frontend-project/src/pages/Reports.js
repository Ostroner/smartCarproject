import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
  const [reports, setReports] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reports');
      setReports(response.data.data || []);
      
      const total = (response.data.data || []).reduce((sum, item) => sum + (item.totalAmount || 0), 0);
      setTotalRevenue(total);
      
      setError('');
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "License Plate,Service,Cost,Payment,Date\n";
    
    reports.forEach((report) => {
      csvContent += `${report.licensePlate || ''},${report.service || ''},${report.serviceCost || 0},${report.payment || 0},${report.date || ''}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `repair_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-8">📊 Daily Reports</h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg shadow-xl p-6 border border-green-700">
          <h3 className="text-purple-300 font-medium mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold text-green-400">{totalRevenue.toLocaleString()} Rwf</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-xl p-6 border border-blue-700">
          <h3 className="text-blue-300 font-medium mb-2">Total Services</h3>
          <p className="text-4xl font-bold text-blue-400">{reports.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-6 border border-purple-700">
          <h3 className="text-purple-300 font-medium mb-2">Avg. Service Cost</h3>
          <p className="text-4xl font-bold text-purple-400">
            {reports.length > 0 ? Math.round(totalRevenue / reports.length).toLocaleString() : 0} Rwf
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-8 border border-purple-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-100">📋 Service & Payment Report</h2>
          <button
            onClick={downloadReport}
            disabled={reports.length === 0}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
          >
            ⬇️ Download CSV
          </button>
        </div>

        {loading ? (
          <div className="text-center text-purple-300">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="text-center text-purple-300">No report data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-950 border-b border-purple-700">
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">License Plate</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Service</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Service Cost (Rwf)</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Payment (Rwf)</th>
                  <th className="px-6 py-4 text-left text-purple-200 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, idx) => (
                  <tr key={idx} className="border-b border-purple-700 hover:bg-purple-800 transition">
                    <td className="px-6 py-4 text-purple-100">{report.licensePlate || 'N/A'}</td>
                    <td className="px-6 py-4 text-purple-100">{report.service || 'N/A'}</td>
                    <td className="px-6 py-4 text-green-400 font-bold">{(report.serviceCost || 0).toLocaleString()} Rwf</td>
                    <td className="px-6 py-4 text-green-400 font-bold">{(report.payment || 0).toLocaleString()} Rwf</td>
                    <td className="px-6 py-4 text-purple-100">{report.date || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-8 border border-purple-700">
        <h2 className="text-2xl font-bold text-purple-100 mb-6">💳 Generate Bill</h2>
        <div className="text-center">
          <p className="text-purple-300 mb-4">Select a service record from the Service Records page to generate a bill</p>
          <button
            onClick={() => {
              const now = new Date().toLocaleString();
              alert(`Bill for repair service\nGenerated: ${now}\nTotal Amount: View in reports above`);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
          >
            📄 Generate Sample Bill
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
