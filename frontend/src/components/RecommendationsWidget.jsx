// This file should be in frontend/src/components/RecommendationsWidget.jsx
import React from 'react';
import { motion } from 'framer-motion';

const RecommendationsWidget = ({ airQuality, noiseLevel, overallScore }) => {
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
          case 'success': return { icon: '✅', color: 'bg-green-50 border-green-200' };
          case 'warning': return { icon: '⚠️', color: 'bg-yellow-50 border-yellow-200' };
          case 'alert': return { icon: '🚨', color: 'bg-red-50 border-red-200' };
          default: return { icon: 'ℹ️', color: 'bg-blue-50 border-blue-200' };
        }
    };

    return (
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Recommendations</h3>
            <div className="space-y-4">
                {recommendations.length > 0 ? recommendations.map((rec, index) => {
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
                }) : (
                    <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                            <span className="text-lg">ℹ️</span>
                            <div>
                                <div className="font-medium text-gray-900 text-sm">General Advice</div>
                                <div className="text-xs text-gray-600 mt-1">No specific alerts. Monitor conditions and enjoy the day.</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default RecommendationsWidget;