import React, { useState } from 'react';
import MainInputDashboard from './pages/MainInputDashboard';
import EnvironmentalReport from './pages/EnvironmentalReport';
import Home from './pages/Home';
import Features from './pages/Features';
import { fetchReportCard } from './services/apiService.js';

function App() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // dark mode state

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

  const handleEnterDashboard = () => {
    setShowDashboard(true);
    document.getElementById('dashboard-input')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Toggle dark mode handler
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:bg-[#1a1a1a] transition-colors duration-300">
        {/* Dark mode toggle button */}
        <button
  onClick={toggleDarkMode}
  className={`fixed bottom-5 left-5 p-5 rounded-full shadow-lg z-50 text-xl
    ${darkMode ? 'bg-[#504C4C] text-white' : 'bg-gray-100 text-black'}`}
>
  {darkMode ? '☀️' : '🌙'}
</button>


        {/* Home and Features (shown before entering dashboard) */}
        {!showDashboard && (
          <>
            <Home onEnterDashboard={handleEnterDashboard} darkMode={darkMode} />
            <Features darkMode={darkMode} />
          </>
        )}

        {/* Dashboard and Report (shown after clicking Get Started) */}
        {showDashboard && (
          <div id="dashboard-input" className="min-h-screen">
            {error && (
              <div className="p-4 mb-4 text-center text-white bg-red-600 rounded">
                Error: {error}
              </div>
            )}
            {!reportData ? (
              <MainInputDashboard
                onLocationSearch={handleLocationSearch}
                loading={loading}
                darkMode={darkMode} // ✅ pass here
              />
            ) : (
              <EnvironmentalReport
                data={reportData}
                onBack={handleBack}
                darkMode={darkMode} // ✅ pass here
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;







