// src/App.jsx
import React, { useState } from 'react';
import MainInputDashboard from './components/MainInputDashboard';
import EnvironmentalReport from './components/EnvironmentalReport';

function App() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLocationSearch = async (location) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      setTimeout(() => {
        const mockData = {
          location: location,
          coordinates: { lat: 28.6139, lng: 77.2090 },
          overallScore: 68,
          airQuality: {
            aqi: 116,
            level: 'Poor',
            pm25: 40,
            pm10: 107,
            recommendations: ['Limit outdoor activities', 'Use air purifiers indoors']
          },
          noiseLevel: {
            day: 65,
            night: 55,
            limit: 55,
            level: 'Moderate'
          },
          civicComplaints: {
            total: 23,
            resolved: 18,
            pending: 5,
            categories: [
              { name: 'Air Pollution', count: 8 },
              { name: 'Noise Complaints', count: 6 },
              { name: 'Water Quality', count: 5 },
              { name: 'Waste Management', count: 4 }
            ]
          }
        };
        setReportData(mockData);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {!reportData ? (
        <MainInputDashboard onLocationSearch={handleLocationSearch} loading={loading} />
      ) : (
        <EnvironmentalReport data={reportData} onBack={() => setReportData(null)} />
      )}
    </div>
  );
}

export default App;
