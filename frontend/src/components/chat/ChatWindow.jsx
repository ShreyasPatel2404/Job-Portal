import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, Loader2, Sparkles, Minus } from 'lucide-react';
import chatService from '../../services/chatService';
import MessageBubble from './MessageBubble';

const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: "Hello! I'm Antigravity AI. How can I accelerate your career today?",
            intent: 'CAREER_GUIDANCE'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMsg = { sender: 'user', text: message };
        setMessages(prev => [...prev, userMsg]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await chatService.sendMessage(message);
            const aiMsg = {
                sender: 'ai',
                text: response.message,
                intent: response.intent,
                data: response.data
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            let errorText = "Sorry, I'm having trouble connecting right now. Please try again later.";
            if (error.response?.status === 429) {
                errorText = "Whoa there! You're moving a bit too fast. Please wait a minute before asking more questions.";
            }
            setMessages(prev => [...prev, {
                sender: 'ai',
                text: errorText,
                intent: 'ERROR'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50 group"
            >
                <MessageSquare className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                <span className="absolute right-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Talk to Antigravity AI
                </span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 w-96 max-h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 border border-gray-100 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Antigravity AI</h3>
                        <p className="text-[10px] text-blue-100 uppercase tracking-widest">Career Strategy Engine</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded">
                        <Minus className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Chat area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                        {messages.map((msg, idx) => (
                            <MessageBubble key={idx} message={msg} />
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-blue-50 flex items-center gap-2 shadow-sm">
                                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                    <span className="text-xs text-gray-500">Antigravity is thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                        <div className="relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask about jobs, skills, or resume..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !message.trim()}
                                className="absolute right-2 top-1.5 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-300"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-400 mt-2">
                            AI-driven insights for professional growth
                        </p>
                    </form>
                </>
            )}
        </div>
    );
};

export default ChatWindow;
