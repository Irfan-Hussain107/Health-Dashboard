import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SparklesIcon } from '@heroicons/react/24/solid';

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
                setComparison({ prosA: "N/A", consA: "N/A", prosB: "N/A", consB: "N/A" });
            }
            setLoading(false);
        };
        if (reports.length >= 2) {
            getComparison();
        }
    }, [reports]);

    if (loading) return (
        <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
            Generating AI Comparison...
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-purple-500" />
                AI-Powered Comparison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                    <h4 className="font-bold text-gray-800 mb-2 truncate">{reports[0].location}</h4>
                    <div className="space-y-2">
                        <p className="text-sm text-green-700"><span className="font-semibold">Pros:</span> {comparison?.prosA}</p>
                        <p className="text-sm text-red-700"><span className="font-semibold">Cons:</span> {comparison?.consA}</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 mb-2 truncate">{reports[1].location}</h4>
                    <div className="space-y-2">
                        <p className="text-sm text-green-700"><span className="font-semibold">Pros:</span> {comparison?.prosB}</p>
                        <p className="text-sm text-red-700"><span className="font-semibold">Cons:</span> {comparison?.consB}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIComparisonWidget;