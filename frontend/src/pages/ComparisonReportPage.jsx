import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AirQualityWidget from '../components/AirQualityWidget';
import NoiseWidget from '../components/NoiseWidget';
import CivicComplaintsWidget from '../components/CivicComplaintsWidget';
import AIComparisonWidget from '../components/AIComparisonWidget';

const ComparisonReportPage = ({ data, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-screen-xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="h-5 w-5" /> Back to Search
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">Side-by-Side Comparison</h2>
                </div>
            </div>
            
            <div className="max-w-screen-xl mx-auto p-4">
                <div className="mb-6">
                    <AIComparisonWidget reports={data} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Map over the reports and create a column for each */}
                    {data.map((report, index) => (
                        <div key={index} className="space-y-6">
                            <div className="text-center border-b pb-4">
                                <h3 className="text-xl font-bold text-gray-800 truncate">{report.location}</h3>
                                <p className="text-sm text-gray-500">Overall Score: {report.overallScore}</p>
                            </div>
                            <AirQualityWidget data={report.airQuality} />
                            <NoiseWidget data={report.noiseLevel} />
                            <CivicComplaintsWidget data={report.civicComplaints} location={report.location}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ComparisonReportPage;