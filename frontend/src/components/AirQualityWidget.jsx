// src/components/AirQualityWidget.jsx
import React from 'react';

const AirQualityWidget = ({ data }) => {
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Air Quality Index</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{data.aqi}</div>
          <div className={`text-sm font-medium px-2 py-1 rounded text-white ${getAQIColor(data.aqi)}`}>
            {getAQILevel(data.aqi)}
          </div>
        </div>
      </div>

      {/* AQI Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0</span>
          <span>Good</span>
          <span>Moderate</span>
          <span>Unhealthy</span>
          <span>300+</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getAQIColor(data.aqi)} transition-all duration-500`}
            style={{ width: `${Math.min((data.aqi / 300) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Pollutant Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">{data.pm25}</div>
          <div className="text-xs text-gray-500">PM2.5 (μg/m³)</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">{data.pm10}</div>
          <div className="text-xs text-gray-500">PM10 (μg/m³)</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default AirQualityWidget;
