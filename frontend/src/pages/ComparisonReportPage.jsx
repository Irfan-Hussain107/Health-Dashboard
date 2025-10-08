import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AirQualityWidget from '../components/AirQualityWidget';
import NoiseWidget from '../components/NoiseWidget';
import CivicComplaintsWidget from '../components/CivicComplaintsWidget';
import AIComparisonWidget from '../components/AIComparisonWidget';
import ChatbotWidget from '../components/ChatbotWidget';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ComparisonReportPage = ({ data, onBack, darkMode }) => {
    const COLORS = ['#10B981', darkMode ? '#444' : '#E5E7EB']; // green for score, gray for remaining

    const renderScoreCircle = (score) => {
        const percentage = Math.min(Math.max(score, 0), 100);
        const chartData = [
            { name: 'Score', value: percentage },
            { name: 'Remaining', value: 100 - percentage },
        ];

        return (
            <div className="relative w-28 h-28 mx-auto"> {/* bigger size */}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            innerRadius="65%" // thicker ring
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
                    <p className="text-lg font-semibold">{percentage}</p>
                    <p className="text-[11px] text-gray-400">{darkMode ? 'Score' : 'Score'}</p>
                </div>
            </div>
        );
    };

    const reportA = data[0];
    const reportB = data[1];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#1a1a1a] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <div className={`shadow-sm border-b sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="max-w-screen-xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
                    <button onClick={onBack} className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                        <ArrowLeftIcon className="h-5 w-5" /> Back to Search
                    </button>
                    <h2 className="text-lg font-semibold">Side-by-Side Comparison</h2>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-screen-xl mx-auto px-2 py-2 sm:px-4 lg:px-6">
                <div className="mb-3">
                    <AIComparisonWidget reports={data} darkMode={darkMode} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Column 1 for Address A */}
                    <div className={`rounded-xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 flex flex-col gap-2`}>
                        <div className={`text-center border-b pb-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className="text-lg font-semibold truncate">{reportA.location}</h3>
                            <div className="mt-2">{renderScoreCircle(reportA.overallScore)}</div>
                        </div>
                        <AirQualityWidget data={reportA.airQuality} darkMode={darkMode} />
                        <NoiseWidget data={reportA.noiseLevel} darkMode={darkMode} />
                        <CivicComplaintsWidget data={reportA.civicComplaints} location={reportA.location} darkMode={darkMode} />
                    </div>

                    {/* Column 2 for Address B */}
                    <div className={`rounded-xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 flex flex-col gap-2`}>
                        <div className={`text-center border-b pb-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className="text-lg font-semibold truncate">{reportB.location}</h3>
                            <div className="mt-2">{renderScoreCircle(reportB.overallScore)}</div>
                        </div>
                        <AirQualityWidget data={reportB.airQuality} darkMode={darkMode} />
                        <NoiseWidget data={reportB.noiseLevel} darkMode={darkMode} />
                        <CivicComplaintsWidget data={reportB.civicComplaints} location={reportB.location} darkMode={darkMode} />
                    </div>
                </div>
            </div>

            <ChatbotWidget reportContext={data} darkMode={darkMode} />
        </div>
    );
};

export default ComparisonReportPage;

