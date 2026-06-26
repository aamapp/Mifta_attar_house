/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, ArrowUp, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingButtons() {
  const { language, addToast } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Assalamu Alaikum! Welcome to Mifta Attar House. How can I assist you with our non-alcoholic pure fragrances today?' }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() === '') return;

    const userText = chatMessage;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');

    // Simulated reply
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Jazakallah Khair for reaching out! Our dedicated fragrance advisor is analyzing your query. You can also directly ping us on WhatsApp: +8801712345678 for instant delivery.'
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 left-6 sm:right-6 sm:left-auto z-40 flex flex-col gap-3 pointer-events-none">
      
      {/* 1. Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="pointer-events-auto p-3.5 rounded-sm border border-stone-200 bg-white hover:bg-stone-50 text-gold-600 hover:text-gold-700 transition-colors shadow-2xl hover:-translate-y-1 transition-transform cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Interactive Messenger/Live Chat widget */}
      <div className="relative">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="pointer-events-auto absolute bottom-16 right-0 w-80 rounded-sm border border-stone-200 bg-white text-stone-900 shadow-2xl p-4 flex flex-col gap-3 z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-600 font-sans">Mifta Advisor Chat</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-stone-400 hover:text-stone-900 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chat Log History */}
              <div className="h-48 overflow-y-auto space-y-3.5 text-xs pr-1">
                {chatHistory.map((ch, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-sm max-w-[85%] ${
                      ch.sender === 'user'
                        ? 'bg-gold-500 text-black font-bold self-end ml-auto'
                        : 'bg-stone-50 text-stone-800 border border-stone-200 mr-auto text-left'
                    }`}
                  >
                    {ch.text}
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChat} className="relative mt-1">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Type a question...' : 'জিজ্ঞাসা লিখুন...'}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 rounded-sm bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-gold-500"
                />
                <button type="submit" className="absolute right-2.5 top-2.5 text-gold-600 hover:text-gold-700 cursor-pointer">
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Chat Trigger Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="pointer-events-auto p-4 rounded-full bg-gold-500 text-black hover:brightness-110 transition-all shadow-2xl hover:scale-105 transform active:scale-95 cursor-pointer flex items-center justify-center"
          title="Live Chat Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}

// Inline custom X close icon helper
function X(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
