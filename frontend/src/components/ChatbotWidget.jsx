import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import axios from 'axios';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const CustomHeader = ({ onClose, darkMode }) => {
    return (
        <div className={`p-4 rounded-t-2xl flex items-center justify-between ${darkMode ? 'bg-[#222] text-gray-100' : 'bg-green-600 text-white'}`}>
            <div className="flex items-center">
                <div className="relative mr-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${darkMode ? 'bg-green-700 text-white' : 'bg-green-700 text-white'}`}>
                        E
                    </div>
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-green-600"></span>
                </div>
                <div>
                    <div className="font-semibold">EcoBot</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-green-200'}`}>Online</div>
                </div>
            </div>
            <button 
                onClick={onClose}
                className={`p-1 rounded-full transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-green-200 hover:bg-green-700 hover:text-white'}`}
                title="Close Chat"
            >
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

const ChatbotWidget = ({ reportContext, darkMode }) => {
    const [showChatbot, setShowChatbot] = useState(false);
    
    const config = {
        botName: "EcoBot",
        initialMessages: [
            {
                id: 1,
                message: `Hello! I'm EcoBot. Ask me any questions about this report.`,
                delay: 500,
            },
        ],
        customComponents: {
            header: () => <CustomHeader onClose={() => setShowChatbot(false)} darkMode={darkMode} />,
        },
        customStyles: {
            botMessageBox: { backgroundColor: darkMode ? '#10b981' : '#10b981' },
            chatButton: { backgroundColor: darkMode ? '#10b981' : '#10b981' },
            chatInput: { backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' },
        },
    };

    class MessageParser {
        constructor(actionProvider) { 
            this.actionProvider = actionProvider; 
        }
        parse(message) { 
            this.actionProvider.handleUserMessage(message); 
        }
    }
    
    class ActionProvider {
        constructor(createChatBotMessage, setStateFunc) {
            this.createChatBotMessage = createChatBotMessage;
            this.setState = setStateFunc;
        }
        async handleUserMessage(message) {
            const thinkingMessage = this.createChatBotMessage("EcoBot is thinking...");
            this.addMessageToState(thinkingMessage);
            try {
                const response = await axios.post('http://127.0.0.1:3001/api/chat', {
                    question: message,
                    contextData: reportContext,
                });
                const botMessage = this.createChatBotMessage(response.data.answer);
                this.updateLastMessage(botMessage);
            } catch (error) {
                console.error("Chat error:", error);
                const errorMessage = this.createChatBotMessage("Sorry, I'm having trouble connecting right now.");
                this.updateLastMessage(errorMessage);
            }
        }
        updateLastMessage = (message) => { 
            this.setState((prevState) => ({ 
                ...prevState, 
                messages: [...prevState.messages.slice(0, -1), message] 
            })); 
        };
        addMessageToState = (message) => { 
            this.setState((prevState) => ({ 
                ...prevState, 
                messages: [...prevState.messages, message] 
            })); 
        };
    }

    const chatbotVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 40 } }
    };
    
    return (
        <>
            {!showChatbot && (
                <motion.button
                    onClick={() => setShowChatbot(true)}
                    className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-20 ${darkMode ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
                    title="Ask EcoBot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                >
                    <ChatBubbleLeftRightIcon className="h-8 w-8" />
                </motion.button>
            )}

            <AnimatePresence>
                {showChatbot && (
                    <motion.div
                        className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-20 w-full sm:w-[450px] h-full sm:h-[650px]"
                        variants={chatbotVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <div className={`h-full flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl border ${darkMode ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-200'}`}>
                            <style>{`
                                .react-chatbot-kit-chat-container {
                                    width: 100%;
                                    height: 100%;
                                    box-shadow: none !important;
                                }
                                .react-chatbot-kit-chat-inner-container {
                                    height: 100%;
                                    display: flex;
                                    flex-direction: column;
                                }
                                .react-chatbot-kit-chat-message-container {
                                    flex: 1;
                                    overflow-y: auto;
                                    padding: 16px;
                                    background-color: ${darkMode ? '#1a1a1a' : '#fff'};
                                    color: ${darkMode ? '#fff' : '#000'};
                                }
                                .react-chatbot-kit-chat-input-container {
                                    padding: 16px;
                                }
                                .react-chatbot-kit-chat-input-form {
                                    display: flex;
                                    gap: 8px;
                                }
                                .react-chatbot-kit-chat-input {
                                    flex: 1;
                                    background-color: ${darkMode ? '#333' : '#fff'};
                                    color: ${darkMode ? '#fff' : '#000'};
                                    border: 1px solid ${darkMode ? '#555' : '#ddd'};
                                }
                                .react-chatbot-kit-chat-bot-message-container {
                                    display: flex;
                                    justify-content: flex-start;
                                    margin-bottom: 12px;
                                }
                                .react-chatbot-kit-user-chat-message-container {
                                    display: flex;
                                    justify-content: flex-end;
                                    margin-bottom: 12px;
                                }
                                .react-chatbot-kit-chat-bot-message {
                                    width: 80%;
                                    max-width: 70%;
                                    margin-left: 8px;
                                }
                                .react-chatbot-kit-user-chat-message {
                                    max-width: 75%;
                                    margin-right: 8px;
                                }
                            `}</style>
                            <Chatbot
                                config={config}
                                messageParser={MessageParser}
                                actionProvider={ActionProvider}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatbotWidget;
