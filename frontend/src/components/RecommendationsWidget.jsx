import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationCircleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const RecommendationsWidget = ({ airQuality, noiseLevel, overallScore, darkMode }) => {
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const getRecommendations = () => {
        const recommendations = [];
        if (airQuality.aqi > 100) {
            recommendations.push({ type: 'warning', title: 'Air Quality Alert', message: 'Limit prolonged outdoor activities.' });
        }
        if (noiseLevel.day > 65) {
            recommendations.push({ type: 'warning', title: 'High Daytime Noise', message: 'Consider soundproofing for work-from-home.' });
        }
        if (overallScore < 60) {
            recommendations.push({ type: 'alert', title: 'Health Advisory', message: 'Area may be unsuitable for sensitive individuals.' });
        }
        if (overallScore >= 80) {
            recommendations.push({ type: 'success', title: 'Good Environment', message: 'Environmental health indicators are strong.' });
        }
        return recommendations;
    };

    const recommendations = getRecommendations();

    const getIconAndColor = (type) => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
                    color: darkMode ? 'bg-green-700 border-green-700' : 'bg-green-50 border-green-200',
                    textColor: darkMode ? 'text-green-300' : 'text-green-700'
                };
            case 'warning':
                return {
                    icon: <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />,
                    color: darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200',
                    textColor: darkMode ? 'text-yellow-300' : 'text-yellow-700'
                };
            case 'alert':
                return {
                    icon: <ExclamationCircleIcon className="h-6 w-6 text-red-600" />,
                    color: darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200',
                    textColor: darkMode ? 'text-red-300' : 'text-red-700'
                };
            default:
                return {
                    icon: <InformationCircleIcon className="h-6 w-6 text-blue-600" />,
                    color: darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200',
                    textColor: darkMode ? 'text-blue-300' : 'text-blue-700'
                };
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            className={`rounded-xl shadow-sm border p-6 h-full transition-colors duration-300
                ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'}`}
        >
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Health Recommendations</h3>
            <div className="space-y-4">
                {recommendations.length > 0 ? (
                    recommendations.map((rec, index) => {
                        const { icon, color, textColor } = getIconAndColor(rec.type);
                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border transition-colors duration-300 ${color}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div>{icon}</div>
                                    <div>
                                        <div className={`font-medium text-sm ${textColor}`}>{rec.title}</div>
                                        <div className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{rec.message}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={`p-4 rounded-lg border transition-colors duration-300 ${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                        <div className="flex items-start gap-3">
                            <InformationCircleIcon className="h-6 w-6 text-blue-500" />
                            <div>
                                <div className={`font-medium text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>General Advice</div>
                                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    No specific alerts. Monitor conditions and enjoy the day.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default RecommendationsWidget;


