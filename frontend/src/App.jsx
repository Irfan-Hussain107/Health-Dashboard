import React, { useState } from 'react';
import MainInputDashboard from './pages/MainInputDashboard';
import EnvironmentalReport from './pages/EnvironmentalReport';
import Home from './pages/Home';
import Features from './pages/Features';
import { fetchReportCard } from './services/apiService.js';
import ComparisonReportPage from './pages/ComparisonReportPage'; // Import the new comparison page

function App() {
  // We change the initial state for reportData from 'null' to an empty array [].
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // This function is now updated to handle both a single location (string)
  // and multiple locations (array of strings).
  const handleLocationSearch = async (locations) => {
    setLoading(true);
    setError('');
    try {
      // We ensure the input is always an array for consistent logic.
      const locationsArray = Array.isArray(locations) ? locations : [locations];
      
      // We use Promise.all to fetch all reports in parallel for better performance.
      const dataPromises = locationsArray.map(loc => fetchReportCard(loc));
      const results = await Promise.all(dataPromises);
      
      // We store the array of results in our state.
      setReportData(results);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch report(s).');
    } finally {
      setLoading(false);
    }
  };

  // The back button now resets the reportData to an empty array.
  const handleBack = () => {
    setReportData([]);
    setError('');
  };

  // This landing page logic remains the same.
  const handleEnterDashboard = () => {
    setShowDashboard(true);
    document.getElementById('dashboard-input')?.scrollIntoView({ behavior: 'smooth' });
  };

  // The dark mode toggle logic remains the same.
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:bg-[#1a1a1a] transition-colors duration-300">
        <button
          onClick={toggleDarkMode}
          className={`fixed bottom-5 left-5 p-5 rounded-full shadow-lg z-50 text-xl ${darkMode ? 'bg-[#504C4C] text-white' : 'bg-gray-100 text-black'}`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {!showDashboard && (
          <>
            <Home onEnterDashboard={handleEnterDashboard} darkMode={darkMode} />
            <Features darkMode={darkMode} />
          </>
        )}

        {showDashboard && (
          <div id="dashboard-input" className="min-h-screen">
            {error && (
              <div className="p-4 mb-4 text-center text-white bg-red-600 rounded">
                Error: {error}
              </div>
            )}

            {/* This is the new rendering logic. It checks the length of the reportData array. */}
            
            {/* If the array is empty, show the search dashboard. */}
            {reportData.length === 0 && (
              <MainInputDashboard
                onLocationSearch={handleLocationSearch}
                loading={loading}
                darkMode={darkMode}
              />
            )}

            {/* If the array has exactly one item, show the single report page. */}
            {reportData.length === 1 && (
              <EnvironmentalReport
                data={reportData[0]} // Pass the single report object, not the array
                onBack={handleBack}
                darkMode={darkMode}
              />
            )}
            
            {/* If the array has more than one item, show the new comparison page. */}
            {reportData.length > 1 && (
              <ComparisonReportPage
                data={reportData} // Pass the full array of reports
                onBack={handleBack}
                darkMode={darkMode}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;