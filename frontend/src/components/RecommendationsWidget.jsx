// src/components/RecommendationsWidget.jsx
import React from 'react';

const RecommendationsWidget = ({ airQuality, noiseLevel, overallScore }) => {
  const getRecommendations = () => {
    const recommendations = [];

    if (airQuality.aqi > 100) {
      recommendations.push({
        type: 'warning',
        title: 'Air Quality Alert',
        message: 'Limit outdoor activities, especially exercise'
      });
      recommendations.push({
        type: 'info',
        title: 'Indoor Air',
        message: 'Use air purifiers and keep windows closed'
      });
    }

    if (noiseLevel.day > 65 || noiseLevel.night > 55) {
      recommendations.push({
        type: 'warning',
        title: 'Noise Levels',
        message: 'Consider soundproofing for better sleep quality'
      });
    }

    if (overallScore < 60) {
      recommendations.push({
        type: 'alert',
        title: 'Health Advisory',
        message: 'Consider alternative locations for sensitive individuals'
      });
    }

    // Always add some positive recommendations
    if (overallScore >= 70) {
      recommendations.push({
        type: 'success',
        title: 'Good Environment',
        message: 'This area shows good environmental health indicators'
      });
    }

    recommendations.push({
      type: 'info',
      title: 'Stay Updated',
      message: 'Check environmental data regularly for changes'
    });

    return recommendations;
  };

  const recommendations = getRecommendations();

  const getIconAndColor = (type) => {
    switch (type) {
      case 'success': return { icon: '✅', color: 'bg-green-50 border-green-200' };
      case 'warning': return { icon: '⚠️', color: 'bg-yellow-50 border-yellow-200' };
      case 'alert': return { icon: '🚨', color: 'bg-red-50 border-red-200' };
      default: return { icon: 'ℹ️', color: 'bg-blue-50 border-blue-200' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Recommendations</h3>
      
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const { icon, color } = getIconAndColor(rec.type);
          return (
            <div key={index} className={`p-4 rounded-lg border ${color}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg">{icon}</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{rec.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{rec.message}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Data sources: CPCB, Delhi Mitra, AQI.in
        </div>
      </div>
    </div>
  );
};

export default RecommendationsWidget;
