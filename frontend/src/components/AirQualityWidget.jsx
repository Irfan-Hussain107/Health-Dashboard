import React from 'react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CloudIcon } from '@heroicons/react/24/outline';

const AirQualityWidget = ({ data }) => {
    const getAQIColor = (aqi) => {
        if (aqi <= 50) return '#22c55e'; // Green
        if (aqi <= 100) return '#facc15'; // Yellow
        if (aqi <= 150) return '#f97316'; // Orange
        if (aqi <= 200) return '#ef4444'; // Red
        return '#8b5cf6'; // Purple
    };

    const color = getAQIColor(data.aqi);
    const chartData = [{ name: 'AQI', value: data.aqi }];

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Air Quality Index</h3>
                <CloudIcon className="h-6 w-6 text-gray-400"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="relative h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="70%"
                            outerRadius="100%"
                            data={chartData}
                            startAngle={90}
                            endAngle={-270}
                            barSize={20}
                        >
                            <PolarAngleAxis type="number" domain={[0, 300]} tick={false} />
                            <RadialBar dataKey="value" cornerRadius={10} background fill={color} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-4xl font-bold" style={{ color: color }}>{data.aqi}</div>
                        <div className="text-sm font-medium text-gray-500">AQI</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-semibold text-gray-900">{data.pm25}</div>
                        <div className="text-xs text-gray-500">PM2.5 (μg/m³)</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900">{data.pm10}</div>
                        <div className="text-xs text-gray-500">PM10 (μg/m³)</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AirQualityWidget;