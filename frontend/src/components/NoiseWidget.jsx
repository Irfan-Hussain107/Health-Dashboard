// src/components/NoiseWidget.jsx
import React from 'react';

const NoiseWidget = ({ data }) => {
  const getNoiseLevel = (level) => {
    if (level <= 45) return { label: 'Quiet', color: 'text-green-600 bg-green-100' };
    if (level <= 55) return { label: 'Moderate', color: 'text-yellow-600 bg-yellow-100' };
    if (level <= 65) return { label: 'Noisy', color: 'text-orange-600 bg-orange-100' };
    return { label: 'Very Noisy', color: 'text-red-600 bg-red-100' };
  };

  const dayStatus = getNoiseLevel(data.day);
  const nightStatus = getNoiseLevel(data.night);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Noise Pollution Levels</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
          <div>
            <div className="font-semibold text-gray-900">Daytime</div>
            <div className="text-sm text-gray-600">6 AM - 10 PM</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{data.day} dB</div>
            <div className={`text-xs font-medium px-2 py-1 rounded ${dayStatus.color}`}>
              {dayStatus.label}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <div className="font-semibold text-gray-900">Nighttime</div>
            <div className="text-sm text-gray-600">10 PM - 6 AM</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{data.night} dB</div>
            <div className={`text-xs font-medium px-2 py-1 rounded ${nightStatus.color}`}>
              {nightStatus.label}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-900">Residential Area Limit</div>
        <div className="text-xs text-gray-600">
          Day: 55 dB | Night: 45 dB (CPCB Guidelines)
        </div>
      </div>
    </div>
  );
};

export default NoiseWidget;
