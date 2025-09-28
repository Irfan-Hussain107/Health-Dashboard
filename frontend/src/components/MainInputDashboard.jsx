// src/components/MainInputDashboard.jsx
import React, { useState } from 'react';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const MainInputDashboard = ({ onLocationSearch, loading }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) {
      onLocationSearch(address);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSearch(`${latitude}, ${longitude}`);
        },
        (error) => {
          alert('Unable to retrieve your location');
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Uncover the Environmental Health of Your Next Neighborhood.
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
          Get an instant "Environmental Report Card" for any address in Delhi. We analyze 
          real-time air quality, estimate noise levels, and track civic complaints to generate 
          a simple, actionable health score, helping you make a smarter, healthier decision.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter an address or pincode in Delhi..."
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !address.trim()}
              className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  Get Report
                </>
              )}
            </button>
          </div>
        </form>

        {/* Geolocation Option */}
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-sm">or</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <button
          onClick={handleGeolocation}
          disabled={loading}
          className="mt-4 text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
        >
          <MapPinIcon className="h-5 w-5" />
          Use my current location
        </button>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              🌬️
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Air Quality Index</h3>
            <p className="text-sm text-gray-600">Real-time PM2.5, PM10, and AQI data from multiple monitoring stations</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              🔊
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Noise Levels</h3>
            <p className="text-sm text-gray-600">Day and night noise pollution measurements and compliance data</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              📋
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Civic Complaints</h3>
            <p className="text-sm text-gray-600">Local environmental complaints and resolution status from Delhi Mitra</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainInputDashboard;
