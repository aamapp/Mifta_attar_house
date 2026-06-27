/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, ArrowUp, Send, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export default function FloatingButtons() {
  const { language, addToast, products } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'আসসালামু আলাইকুম! মিফতাহ আত্তার হাউজে আপনাকে স্বাগতম। আজ আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    /* 
    if (chatMessage.trim() === '') return;
    ... (chat logic hidden)
    */
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-40 flex flex-col gap-3 pointer-events-none">
      
      {/* 1. Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="pointer-events-auto p-3.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-orange-500 transition-colors shadow-lg hover:-translate-y-1 transform cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Interactive Messenger/Live Chat widget (HIDDEN AS REQUESTED) */}
      {/* 
      <div className="relative">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="pointer-events-auto absolute bottom-16 right-0 w-80 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-2xl p-4 flex flex-col gap-3 z-50"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-500 font-sans">মিফতাহ এআই অ্যাসিস্ট্যান্ট</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div ref={chatContainerRef} className="h-64 overflow-y-auto space-y-3.5 text-xs pr-1 flex flex-col">
                {chatHistory.map((ch, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg max-w-[85%] ${
                      ch.sender === 'user'
                        ? 'bg-orange-500 text-white self-end ml-auto'
                        : 'bg-gray-50 text-gray-800 border border-gray-100 mr-auto text-left'
                    }`}
                  >
                    {ch.sender === 'bot' ? (
                      <div className="markdown-body text-xs">
                        <ReactMarkdown>{ch.text}</ReactMarkdown>
                      </div>
                    ) : (
                      ch.text
                    )}
                  </div>
                ))}
                {isTyping && (
                   <div className="bg-gray-50 text-gray-800 border border-gray-100 mr-auto text-left p-2.5 rounded-lg max-w-[85%] flex items-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                     <span>লিখছে...</span>
                   </div>
                )}
              </div>

              <form onSubmit={handleSendChat} className="relative mt-1">
                <input
                  type="text"
                  placeholder="জিজ্ঞাসা লিখুন..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  disabled={isTyping}
                />
                <button type="submit" disabled={isTyping || chatMessage.trim() === ''} className="absolute right-2.5 top-2.5 text-orange-500 hover:text-orange-600 cursor-pointer disabled:opacity-50">
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="pointer-events-auto p-4 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-xl hover:scale-105 transform active:scale-95 cursor-pointer flex items-center justify-center"
          title="Live Chat Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
      */}


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
