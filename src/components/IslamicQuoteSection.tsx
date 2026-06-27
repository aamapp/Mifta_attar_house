/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ISLAMIC_QUOTES } from '../data';
import { useApp } from '../context/AppContext';
import { HeartHandshake } from 'lucide-react';

export default function IslamicQuoteSection() {
  const { language } = useApp();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % ISLAMIC_QUOTES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const activeQuote = ISLAMIC_QUOTES[index];

  return (
    <section className="py-14 bg-gray-50 text-gray-900 border-y border-gray-200 relative overflow-hidden">
      
      {/* Decorative Star pattern background */}
      <div className="absolute inset-y-0 right-0 left-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg className="w-96 h-96 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 4.8 5.2.8-3.8 3.7.9 5.2-4.7-2.5-4.7 2.5.9-5.2-3.8-3.7 5.2-.8zm0 2.2L10.2 8l-4 .6 2.9 2.8-.7 4 3.6-1.9 3.6 1.9-.7-4 2.9-2.8-4-.6z" />
        </svg>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10 text-center">
        <HeartHandshake className="w-8 h-8 text-orange-500 mx-auto mb-4 animate-pulse" />
        
        <div className="relative h-28 sm:h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <blockquote className="font-serif text-sm sm:text-base md:text-lg italic leading-relaxed text-gray-800">
                {activeQuote.quote[language]}
              </blockquote>
              <cite className="block text-xs font-semibold uppercase tracking-widest text-orange-500 font-sans not-italic">
                — {activeQuote.source[language]}
              </cite>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {ISLAMIC_QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-sm transition-all cursor-pointer ${i === index ? 'w-6 bg-orange-500' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
