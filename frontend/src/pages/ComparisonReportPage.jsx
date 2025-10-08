import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AirQualityWidget from '../components/AirQualityWidget';
import NoiseWidget from '../components/NoiseWidget';
import CivicComplaintsWidget from '../components/CivicComplaintsWidget';
import AIComparisonWidget from '../components/AIComparisonWidget';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ComparisonReportPage = ({ data, onBack, darkMode }) => {
  const COLORS = ['#10B981', darkMode ? '#374151' : '#E5E7EB']; // Adjusted for dark mode

  const renderScoreCircle = (score) => {
    const percentage = Math.min(Math.max(score, 0), 100);
    const chartData = [
      { name: 'Score', value: percentage },
      { name: 'Remaining', value: 100 - percentage },
    ];

    return (
      <div className="relative w-32 h-32 mx-auto">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius="70%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{percentage}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Score</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b sticky top-0 z-10 transition-colors duration-300
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-screen-xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 transition-colors duration-300 
              ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeftIcon className="h-5 w-5" /> Back to Search
          </button>
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Side-by-Side Comparison
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-3 py-4">
        <div className="mb-3">
          <AIComparisonWidget reports={data} darkMode={darkMode} />
        </div>

        {/* Two-column comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((report, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-sm border p-3 flex flex-col gap-3 transition-colors duration-300
                ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'}`}
            >
              {/* Header with circular score */}
              <div className="text-center">
                <h3 className={`text-lg font-semibold truncate ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {report.location}
                </h3>
                <div className="mt-1 flex justify-center">
                  {renderScoreCircle(report.overallScore)}
                </div>
              </div>

              {/* Widgets */}
              <div className="flex flex-col gap-3">
                <AirQualityWidget data={report.airQuality} darkMode={darkMode} />
                <NoiseWidget data={report.noiseLevel} darkMode={darkMode} />
                <CivicComplaintsWidget
                  data={report.civicComplaints}
                  location={report.location}
                  darkMode={darkMode}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonReportPage;




