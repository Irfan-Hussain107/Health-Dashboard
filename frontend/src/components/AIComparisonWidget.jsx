import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SparklesIcon, CheckCircleIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/24/solid';

const AIComparisonWidget = ({ reports, darkMode }) => {
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
            case 'good': return darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200';
            case 'moderate': return darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
            case 'poor': return darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200';
            default: return darkMode ? 'bg-gray-900/20 border-gray-700' : 'bg-gray-50 border-gray-200';
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
        <div className={`rounded-xl border p-6 text-center ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-600'}`}>
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Generating AI-Powered Comparison...</p>
        </div>
    );

    if (!comparison) return (
        <div className={`rounded-xl border p-4 text-center ${darkMode ? 'bg-gray-800text-gray-400 border-gray-700' : 'bg-white text-gray-500 border-gray-200'}`}>
            Unable to generate comparison. Please try again.
        </div>
    );

    return (
        <div className={`rounded-xl shadow-lg border-2 p-4 ${darkMode ? 'bg-gray-800 border-purple-600 text-gray-200' : 'bg-white border-purple-100 text-gray-900'}`}>
            <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                <h3 className="text-lg font-bold">AI-Powered Detailed Comparison</h3>
            </div>

            {/* Location Headers */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className={`text-center p-2 rounded-lg border-2 ${darkMode ? 'bg-blue-900/20 border-blue-600 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
                    <h4 className="font-bold text-sm truncate">📍 Location A</h4>
                    <p className="text-xs truncate">{reports[0].location}</p>
                </div>
                <div className={`text-center p-2 rounded-lg border-2 ${darkMode ? 'bg-purple-900/20 border-purple-600 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'}`}>
                    <h4 className="font-bold text-sm truncate">📍 Location B</h4>
                    <p className="text-xs truncate">{reports[1].location}</p>
                </div>
            </div>

            {['airQuality', 'noiseLevel', 'civicComplaints'].map((key) => (
                <div key={key} className={`mb-3 p-3 rounded-lg border-2 ${getSeverityColor(comparison[key]?.severity)}`}>
                    <div className="flex items-start gap-2 mb-2">
                        <span className="text-xl">{getSeverityEmoji(comparison[key]?.severity)}</span>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-1">
                                {key === 'airQuality' ? '🌫️ Air Quality Index' : key === 'noiseLevel' ? '🔊 Noise Levels' : '📋 Civic Complaints'}
                            </h4>
                            <p className="text-xs leading-relaxed">{comparison[key]?.comparison}</p>
                        </div>
                    </div>
                    <div className="flex justify-around pt-2 border-t border-gray-600/30 text-xs">
                        <div className="flex items-center gap-1">
                            {getWinnerIcon(comparison[key]?.winner, 'A')}
                            Location A
                        </div>
                        <div className="flex items-center gap-1">
                            {getWinnerIcon(comparison[key]?.winner, 'B')}
                            Location B
                        </div>
                    </div>
                </div>
            ))}

            {/* Overall Verdict Circle */}
            <div className={`mt-4 p-4 rounded-full border-2 ${darkMode ? 'border-purple-400 bg-purple-900/20' : 'border-purple-200 bg-purple-50'}`}>
                <h4 className="font-bold text-center text-sm mb-1">🏆 Overall Environmental Health</h4>
                <p className="text-center text-xs">{comparison.overall?.comparison}</p>
                <p className="text-center text-purple-200/80 text-xs mt-1 font-semibold">
                    Recommendation: {comparison.overall?.recommendation}
                </p>
            </div>
        </div>
    );
};

export default AIComparisonWidget;
