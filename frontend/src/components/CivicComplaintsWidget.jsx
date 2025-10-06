import React, {useState} from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ChatBubbleBottomCenterTextIcon, LinkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import ComplaintAssistantModal from './ComplaintAssistantModal';

const CivicComplaintsWidget = ({ data, location }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };
    const mcdLink = "https://mcd.everythingcivic.com/citizen/createissue?app_id=U2FsdGVkX180J3mGnJmT5QpgtPjhfjtzyXAAccBUxGU%3D&api_key=e34ba86d3943bd6db9120313da011937189e6a9625170905750f649395bcd68312cf10d264c9305d57c23688cc2e5120";

    
    // This is placeholder data. Your teammate's ML service will provide this.
    const categories = data.categories || [{ name: 'Waste Management', count: 3 }, { name: 'Noise', count: 1 }];

    return (
        <>
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

                <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Report a New Issue</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                            <EnvelopeIcon className="h-5 w-5" />
                            Draft Email with AI
                        </button>
                        <a
                            href={mcdLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
                        >
                            <LinkIcon className="h-5 w-5" />
                            Go to MCD Portal
                        </a>
                    </div>
                </div>
            </motion.div>
        
            <ComplaintAssistantModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                address={location}
            />

        </>
        
    );
};

export default CivicComplaintsWidget;