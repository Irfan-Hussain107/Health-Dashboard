import React from 'react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { SparklesIcon } from '@heroicons/react/24/solid';

const OverallScoreWidget = ({ score, summary, darkMode }) => {
    const getScoreColor = (s) => {
        if (s >= 80) return '#10b981'; // Emerald
        if (s >= 60) return '#facc15'; // Yellow
        if (s >= 40) return '#f97316'; // Orange
        return '#ef4444'; // Red
    };

    const color = getScoreColor(score);
    const chartData = [{ name: 'Score', value: score }];
    
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <motion.div
            variants={itemVariants}
            className={`rounded-xl shadow-sm border p-6 h-full transition-colors duration-300
                ${darkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-200' 
                    : 'bg-white border-gray-200 text-gray-900'}`}
        >
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Overall Environmental Score
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="relative h-64 md:h-full"> 
                      <ResponsiveContainer width="100%" height="100%">
    <RadialBarChart
        innerRadius="70%"
        outerRadius="100%"
        data={chartData}
        startAngle={90}
        endAngle={-270}
        barSize={20}
    >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
            dataKey="value"
            cornerRadius={10}
            background={{ fill: darkMode ? '#2a2a2a' : '#f3f4f6' }} 
            fill={color}
        />
    </RadialBarChart>
</ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-3xl font-bold" style={{ color: color }}>{score}</div> {/* Smaller font size for score */}
                        <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>out of 100</div> {/* Smaller font size for "out of 100" */}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <h4 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        <SparklesIcon className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                        AI-Powered Summary
                    </h4>
                    <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {summary}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default OverallScoreWidget;

