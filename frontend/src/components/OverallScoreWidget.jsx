import React from 'react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { SparklesIcon } from '@heroicons/react/24/solid';

const OverallScoreWidget = ({ score, summary }) => {
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
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Environmental Score</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="relative h-40 md:h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="70%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270} barSize={20}>
                            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                            <RadialBar dataKey="value" cornerRadius={10} background fill={color} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-4xl font-bold" style={{ color: color }}>{score}</div>
                        <div className="text-sm font-medium text-gray-500">out of 100</div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <SparklesIcon className="h-5 w-5 text-purple-500" />
                        AI-Powered Summary
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                        {summary}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default OverallScoreWidget;