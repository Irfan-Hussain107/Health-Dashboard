import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SparklesIcon, CheckCircleIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/24/solid';

const AIComparisonWidget = ({ reports }) => {
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getComparison = async () => {
            setLoading(true);
            try {
                const response = await axios.post('http://127.0.0.1:3001/api/compare-summary', { reports });
                setComparison(response.data);
            } catch (error) {
                console.error('Comparison error:', error);
                setComparison(null);
            }
            setLoading(false);
        };
        if (reports.length >= 2) {
            getComparison();
        }
    }, [reports]);

    const getWinnerIcon = (winner, locationKey) => {
        if (winner === 'tie') return <MinusCircleIcon className="h-6 w-6 text-yellow-500" />;
        if (winner === locationKey) return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
    };

    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'good': return 'bg-green-50 border-green-200';
            case 'moderate': return 'bg-yellow-50 border-yellow-200';
            case 'poor': return 'bg-red-50 border-red-200';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    const getSeverityEmoji = (severity) => {
        switch(severity) {
            case 'good': return '✅';
            case 'moderate': return '⚠️';
            case 'poor': return '❌';
            default: return '➖';
        }
    };

    if (loading) return (
        <div className="bg-white rounded-xl border p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Generating AI-Powered Comparison...</p>
        </div>
    );

    if (!comparison) return (
        <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
            Unable to generate comparison. Please try again.
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border-2 border-purple-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <SparklesIcon className="h-7 w-7 text-purple-500" />
                <h3 className="text-xl font-bold text-gray-900">AI-Powered Detailed Comparison</h3>
            </div>

            {/* Location Headers */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <h4 className="font-bold text-lg text-blue-900 truncate">📍 Location A</h4>
                    <p className="text-sm text-blue-700 truncate">{reports[0].location}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <h4 className="font-bold text-lg text-purple-900 truncate">📍 Location B</h4>
                    <p className="text-sm text-purple-700 truncate">{reports[1].location}</p>
                </div>
            </div>

            {/* Air Quality Comparison */}
            <div className={`mb-4 p-4 rounded-lg border-2 ${getSeverityColor(comparison.airQuality?.severity)}`}>
                <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{getSeverityEmoji(comparison.airQuality?.severity)}</span>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">🌫️ Air Quality Index</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{comparison.airQuality?.comparison}</p>
                    </div>
                </div>
                <div className="flex justify-around pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        {getWinnerIcon(comparison.airQuality?.winner, 'A')}
                        <span className="text-sm font-medium text-gray-700">Location A</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {getWinnerIcon(comparison.airQuality?.winner, 'B')}
                        <span className="text-sm font-medium text-gray-700">Location B</span>
                    </div>
                </div>
            </div>

            {/* Noise Level Comparison */}
            <div className={`mb-4 p-4 rounded-lg border-2 ${getSeverityColor(comparison.noiseLevel?.severity)}`}>
                <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{getSeverityEmoji(comparison.noiseLevel?.severity)}</span>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">🔊 Noise Levels</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{comparison.noiseLevel?.comparison}</p>
                    </div>
                </div>
                <div className="flex justify-around pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        {getWinnerIcon(comparison.noiseLevel?.winner, 'A')}
                        <span className="text-sm font-medium text-gray-700">Location A</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {getWinnerIcon(comparison.noiseLevel?.winner, 'B')}
                        <span className="text-sm font-medium text-gray-700">Location B</span>
                    </div>
                </div>
            </div>

            {/* Civic Complaints Comparison */}
            <div className={`mb-4 p-4 rounded-lg border-2 ${getSeverityColor(comparison.civicComplaints?.severity)}`}>
                <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{getSeverityEmoji(comparison.civicComplaints?.severity)}</span>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">📋 Civic Complaints</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{comparison.civicComplaints?.comparison}</p>
                    </div>
                </div>
                <div className="flex justify-around pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        {getWinnerIcon(comparison.civicComplaints?.winner, 'A')}
                        <span className="text-sm font-medium text-gray-700">Location A</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {getWinnerIcon(comparison.civicComplaints?.winner, 'B')}
                        <span className="text-sm font-medium text-gray-700">Location B</span>
                    </div>
                </div>
            </div>

            {/* Overall Verdict */}
            <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    Overall Environmental Health
                </h4>
                <p className="text-gray-700 mb-3 leading-relaxed">{comparison.overall?.comparison}</p>
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                    <p className="text-sm font-semibold text-purple-900">
                        💡 Recommendation: {comparison.overall?.recommendation}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{comparison.overall?.summary}</p>
                </div>
            </div>
        </div>
    );
};

export default AIComparisonWidget;

