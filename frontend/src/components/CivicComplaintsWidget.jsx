import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const CivicComplaintsWidget = ({ data }) => {
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };
    
    // This is placeholder data. Your teammate's ML service will provide this.
    const categories = data.categories || [{ name: 'Waste Management', count: 3 }, { name: 'Noise', count: 1 }];

    return (
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Civic Issues</h3>
                <ExclamationTriangleIcon className="h-6 w-6 text-gray-400"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{data.total}</div>
                    <div className="text-xs text-gray-600">Total Found</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{data.resolved}</div>
                    <div className="text-xs text-gray-600">Est. Resolved</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{data.pending}</div>
                    <div className="text-xs text-gray-600">Est. Pending</div>
                </div>
            </div>

             <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-500" />
                    Detected Complaint Categories
                </h4>
                <div className="space-y-2">
                    {categories.map((category, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <span className="text-sm text-gray-700">{category.name}</span>
                            <span className="text-sm font-semibold text-gray-900">{category.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default CivicComplaintsWidget;