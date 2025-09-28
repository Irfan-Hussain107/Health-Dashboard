// src/components/EnvironmentalReport.jsx
import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
// import ScoreCard from './ScoreCard';
import AirQualityWidget from './AirQualityWidget';
import NoiseWidget from './NoiseWidget';
import CivicComplaintsWidget from './CivicComplaintsWidget';
import RecommendationsWidget from './RecommendationsWidget';

const EnvironmentalReport = ({ data, onBack }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Search
            </button>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-900">{data.location}</h2>
              <p className="text-sm text-gray-500">Environmental Report Card</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Overall Score */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Overall Environmental Health Score</h3>
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${getScoreColor(data.overallScore)}`}>
              {data.overallScore}
            </div>
            <p className="text-xl font-semibold text-gray-700 mt-4">{getScoreLabel(data.overallScore)}</p>
            <p className="text-gray-500 mt-2">Based on air quality, noise levels, and civic complaint data</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <AirQualityWidget data={data.airQuality} />
          <NoiseWidget data={data.noiseLevel} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CivicComplaintsWidget data={data.civicComplaints} />
          </div>
          <div>
            <RecommendationsWidget 
              airQuality={data.airQuality}
              noiseLevel={data.noiseLevel}
              overallScore={data.overallScore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalReport;
