import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SparklesIcon } from '@heroicons/react/24/solid';

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
                setComparison({ prosA: "N/A", consA: "N/A", prosB: "N/A", consB: "N/A" });
            }
            setLoading(false);
        };
        if (reports.length >= 2) {
            getComparison();
        }
    }, [reports]);

    if (loading) return (
        <div
            className={`rounded-xl border p-6 text-center transition-colors duration-300
                ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}
        >
            Generating AI Comparison...
        </div>
    );

    return (
        <div
            className={`rounded-xl shadow-sm border p-6 transition-colors duration-300
                ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'}`}
        >
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                <SparklesIcon className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                AI-Powered Comparison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                    <h4 className={`font-bold mb-2 truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {reports[0].location}
                    </h4>
                    <div className="space-y-2">
                        <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                            <span className="font-semibold">Pros:</span> {comparison?.prosA}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                            <span className="font-semibold">Cons:</span> {comparison?.consA}
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className={`font-bold mb-2 truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {reports[1].location}
                    </h4>
                    <div className="space-y-2">
                        <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                            <span className="font-semibold">Pros:</span> {comparison?.prosB}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                            <span className="font-semibold">Cons:</span> {comparison?.consB}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIComparisonWidget;


