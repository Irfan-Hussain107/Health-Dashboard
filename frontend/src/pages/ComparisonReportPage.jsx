import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AirQualityWidget from '../components/AirQualityWidget';
import NoiseWidget from '../components/NoiseWidget';
import CivicComplaintsWidget from '../components/CivicComplaintsWidget';
import AIComparisonWidget from '../components/AIComparisonWidget';
import ChatbotWidget from '../components/ChatbotWidget';

const ComparisonReportPage = ({ data, onBack }) => {
    const reportA = data[0];
    const reportB = data[1];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="shadow-sm border-b sticky top-0 z-10 bg-white border-gray-200">
                <div className="max-w-screen-xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="h-5 w-5" /> Back to Search
                    </button>
                    <h2 className="text-lg font-semibold">Side-by-Side Comparison</h2>
                </div>
            </div>
            
            <div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-6">
                    <AIComparisonWidget reports={[reportA, reportB]} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1 for Address A */}
                    <div className="space-y-6">
                        <div className="text-center border-b pb-4 border-gray-200">
                            <h3 className="text-xl font-bold truncate">{reportA.location}</h3>
                            <p className="text-gray-500">Overall Score: {reportA.overallScore}</p>
                        </div>
                        <AirQualityWidget data={reportA.airQuality} />
                        <NoiseWidget data={reportA.noiseLevel} />
                        <CivicComplaintsWidget data={reportA.civicComplaints} location={reportA.location} />
                    </div>
                    {/* Column 2 for Address B */}
                    <div className="space-y-6">
                        <div className="text-center border-b pb-4 border-gray-200">
                            <h3 className="text-xl font-bold truncate">{reportB.location}</h3>
                            <p className="text-gray-500">Overall Score: {reportB.overallScore}</p>
                        </div>
                        <AirQualityWidget data={reportB.airQuality} />
                        <NoiseWidget data={reportB.noiseLevel} />
                        <CivicComplaintsWidget data={reportB.civicComplaints} location={reportB.location} />
                    </div>
                </div>
            </div>
            
            <ChatbotWidget reportContext={data} />
        </div>
    );
};

export default ComparisonReportPage;