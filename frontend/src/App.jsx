import React, { useState } from 'react';
import MainInputDashboard from './components/MainInputDashboard';
import EnvironmentalReport from './components/EnvironmentalReport';
import { fetchReportCard } from './services/apiService.js';

function App() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocationSearch = async (location) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchReportCard(location);
      setReportData(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch report.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setReportData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {error && <div className="p-4 text-center text-white bg-red-600">Error: {error}</div>}
      
      {!reportData ? (
        <MainInputDashboard onLocationSearch={handleLocationSearch} loading={loading} />
      ) : (
        <EnvironmentalReport data={reportData} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;