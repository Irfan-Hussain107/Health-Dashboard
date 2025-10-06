import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { ArrowPathIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';

const customStyles = {
    content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '600px', border: 'none', borderRadius: '1rem', padding: '0', maxHeight: '90vh', zIndex: 40 },
    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 30 }
};
Modal.setAppElement('#root');

const ComplaintAssistantModal = ({ isOpen, onRequestClose, address }) => {
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
            {/* We've made this main div a flex container that takes up the full height of the modal */}
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">AI Complaint Assistant</h2>
                        <button onClick={onRequestClose} className="p-1"><XMarkIcon className="h-6 w-6 text-gray-500"/></button>
                    </div>
                </div>

                {!draftedEmail ? (
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">Describe the problem in your own words. The AI will draft a formal email for you.</p>
                        <textarea
                            className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 'sadak par kachra jama hai' or 'streetlight not working'"
                            value={userText}
                            onChange={(e) => setUserText(e.target.value)}
                        />
                        <button
                            onClick={handleDraftEmail}
                            disabled={loading || !userText}
                            className="w-full mt-4 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <ArrowPathIcon className="h-5 w-5 animate-spin"/> : null}
                            {loading ? 'Drafting...' : 'Draft Email with AI'}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* This new div wraps the content and makes it scrollable */}
                        <div className="p-6 flex-grow overflow-y-auto ">
                            <div className="mb-4">
                                <label className="font-semibold text-gray-800">Generated Subject:</label>
                                <p className="p-2 bg-gray-100 rounded-md mt-1">{draftedEmail.subject}</p>
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold text-gray-800">Generated Body:</label>
                                <p className="p-2 bg-gray-100 rounded-md mt-1 whitespace-pre-wrap">{draftedEmail.body}</p>
                            </div>
                        </div>
                        {/* This div contains the buttons and is fixed at the bottom */}
                        <div className="p-6 border-t border-gray-200">
                             <button
                                onClick={handleSendEmail}
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                                Open in Email Client
                            </button>
                            <button
                                onClick={() => setDraftedEmail(null)}
                                className="w-full mt-2 text-gray-600 font-medium py-2 rounded-lg hover:bg-gray-100"
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