import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { ArrowPathIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';

const customStyles = {
    content: { 
        top: '50%', 
        left: '50%', 
        right: 'auto', 
        bottom: 'auto', 
        marginRight: '-50%', 
        transform: 'translate(-50%, -50%)', 
        width: '90%', 
        maxWidth: '600px', 
        border: 'none', 
        borderRadius: '1rem', 
        padding: '0', 
        maxHeight: '90vh', 
        zIndex: 40 
    },
    overlay: { 
        backgroundColor: 'rgba(0, 0, 0, 0.75)', 
        zIndex: 30 
    }
};

Modal.setAppElement('#root');

const ComplaintAssistantModal = ({ isOpen, onRequestClose, address, darkMode }) => {
    const [userText, setUserText] = useState('');
    const [draftedEmail, setDraftedEmail] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDraftEmail = async () => {
        setLoading(true);
        setDraftedEmail(null);
        try {
            const response = await axios.post('http://127.0.0.1:3001/api/draft-complaint', {
                userText,
                address
            });
            setDraftedEmail(response.data);
        } catch (error) {
            console.error("Failed to draft email:", error);
            alert("Sorry, the AI assistant could not draft your email right now.");
        }
        setLoading(false);
    };

    const handleSendEmail = () => {
        const to = "mcd-ithelpdesk@mcd.nic.in";
        const subject = encodeURIComponent(draftedEmail.subject);
        const body = encodeURIComponent(draftedEmail.body);
        window.open(`mailto:${to}?subject=${subject}&body=${body}`, '_blank');
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            {/* Main Container */}
            <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
                {/* Header */}
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">AI Complaint Assistant</h2>
                        <button onClick={onRequestClose} className="p-1">
                            <XMarkIcon className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {!draftedEmail ? (
                    <div className="p-6">
                        <p className={`text-gray-600 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Describe the problem in your own words. The AI will draft a formal email for you.
                        </p>
                        <textarea
                            className={`w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900'}`}
                            placeholder="e.g., 'sadak par kachra jama hai' or 'streetlight not working'"
                            value={userText}
                            onChange={(e) => setUserText(e.target.value)}
                        />
                        <button
                            onClick={handleDraftEmail}
                            disabled={loading || !userText}
                            className={`w-full mt-4 ${darkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700'} font-semibold py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2`}
                        >
                            {loading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : null}
                            {loading ? 'Drafting...' : 'Draft Email with AI'}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Drafted Email Content */}
                        <div className="p-6 flex-grow overflow-y-auto">
                            <div className="mb-4">
                                <label className="font-semibold">Generated Subject:</label>
                                <p className="p-2 bg-gray-100 rounded-md mt-1">{draftedEmail.subject}</p>
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold">Generated Body:</label>
                                <p className="p-2 bg-gray-100 rounded-md mt-1 whitespace-pre-wrap">{draftedEmail.body}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
                            <button
                                onClick={handleSendEmail}
                                className={`w-full ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'} font-semibold py-3 rounded-lg flex items-center justify-center gap-2`}
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                                Open in Email Client
                            </button>
                            <button
                                onClick={() => setDraftedEmail(null)}
                                className={`w-full mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium py-2 rounded-lg hover:bg-gray-100`}
                            >
                                Start Over
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ComplaintAssistantModal;
