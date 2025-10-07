import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AirQualityWidget from '../components/AirQualityWidget';
import NoiseWidget from '../components/NoiseWidget';
import CivicComplaintsWidget from '../components/CivicComplaintsWidget';
import RecommendationsWidget from '../components/RecommendationsWidget';
import OverallScoreWidget from '../components/OverallScoreWidget';
import ChatbotWidget from '../components/ChatbotWidget';

const EnvironmentalReport = ({ data, onBack, darkMode }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#121212] text-gray-200' : 'bg-gray-50 text-gray-900'}`}>
            <div className={`shadow-sm border-b sticky top-0 z-10 transition-colors duration-300
                ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
            >
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <button
                          onClick={onBack}
                          className={`flex items-center gap-2 transition-colors duration-300
                            ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <ArrowLeftIcon className="h-5 w-5" /> Back to Search
                        </button>
                        <div className="text-right">
                            <h2 className="text-lg font-semibold truncate">{data.location}</h2>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Environmental Report Card</p>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div 
                className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="lg:col-span-3">
                    <OverallScoreWidget score={data.overallScore} summary={data.aiSummary} darkMode={darkMode} />
                </div>
                <div className="lg:col-span-2">
                    <AirQualityWidget data={data.airQuality} darkMode={darkMode} />
                </div>
                <div>
                    <NoiseWidget data={data.noiseLevel} darkMode={darkMode} />
                </div>
                <div className="lg:col-span-3">
                    <CivicComplaintsWidget data={data.civicComplaints} location={data.location} darkMode={darkMode} />
                </div>
                <div className="lg:col-span-3">
                   <RecommendationsWidget 
    airQuality={data.airQuality} 
    noiseLevel={data.noiseLevel} 
    overallScore={data.overallScore} 
    darkMode={darkMode} 
/>

                </div>
            </motion.div>

            <ChatbotWidget reportContext={data} darkMode={darkMode} />
        </div>
    );
};

export default EnvironmentalReport;
