/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, Flame, Clock } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onFlashSale: () => void;
}

export default function Hero({ onExplore, onFlashSale }: HeroProps) {
  const { language, websiteSettings } = useApp();

  return (
    <section id="hero" className="w-full bg-white pb-6 pt-2">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container */}
        <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 min-h-[160px] sm:min-h-[280px] lg:min-h-[360px] flex items-center shadow-sm cursor-pointer" onClick={onExplore}>
          
          <div className="flex flex-col md:flex-row w-full h-full items-center justify-between p-6 sm:p-12 relative z-10 gap-6">
            
            {/* Left side: Images/Graphics (Represented by placeholders or styled div for now, but we can use an image if we had one) */}
            <div className="w-full md:w-1/2 flex items-center justify-center relative min-h-[120px] sm:min-h-[200px]">
              {/* Product mockups cluster */}
              <div className="absolute bottom-0 flex items-end gap-2 sm:gap-4 drop-shadow-xl">
                <div className="w-20 h-32 sm:w-32 sm:h-48 bg-white rounded-t-full rounded-b-lg border-4 border-yellow-300 flex items-center justify-center shadow-lg relative overflow-hidden">
                   <div className="absolute inset-x-0 bottom-0 h-1/2 bg-yellow-100" />
                   <span className="text-yellow-600 font-bold text-xs sm:text-sm z-10">HONEY</span>
                </div>
                <div className="w-24 h-40 sm:w-40 sm:h-56 bg-black rounded-t-full rounded-b-lg border-4 border-gray-800 flex items-center justify-center shadow-2xl relative overflow-hidden z-10">
                   <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gray-900" />
                   <span className="text-white font-bold text-sm sm:text-base z-10 text-center">BLACK SEED<br/>HONEY</span>
                </div>
                <div className="w-16 h-24 sm:w-28 sm:h-40 bg-orange-200 rounded-t-full rounded-b-lg border-4 border-orange-300 flex items-center justify-center shadow-md relative overflow-hidden">
                   <div className="absolute inset-x-0 bottom-0 h-1/3 bg-orange-300" />
                   <span className="text-orange-800 font-bold text-[10px] sm:text-xs z-10">SUNDARBAN</span>
                </div>
              </div>
            </div>

            {/* Right side: Text */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right space-y-2 sm:space-y-4">
              <h2 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                {language === 'en' ? 'Directly from nature to your home' : 'সরাসরি প্রকৃতি থেকে আপনার ঘরে'}
              </h2>
              <p className="text-lg sm:text-2xl lg:text-4xl font-black text-gray-900 bg-yellow-300 px-3 py-1 rounded">
                {language === 'en' ? 'ORDER TODAY' : 'আজই অর্ডার করুন'}
              </p>
            </div>

          </div>

          {/* Dots Indicator (Visual Only) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white opacity-100" />
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white opacity-50" />
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-600 opacity-50" />
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white opacity-50" />
          </div>

        </div>
      </div>
    </section>
  );
}
