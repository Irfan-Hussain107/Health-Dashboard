// This file should be in frontend/src/components/NoiseWidget.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';

const NoiseWidget = ({ data }) => {
    const chartData = [
        { name: 'Day', level: data.day, limit: 55 },
        { name: 'Night', level: data.night, limit: 45 },
    ];
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Estimated Noise Levels (dB)</h3>
                <SpeakerWaveIcon className="h-6 w-6 text-gray-400"/>
            </div>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip cursor={{ fill: 'rgba(236, 252, 241, 0.5)' }}/>
                        <Bar dataKey="level" fill="#10b981" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default NoiseWidget;