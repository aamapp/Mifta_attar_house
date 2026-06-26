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
    <section id="hero" className="relative overflow-hidden bg-white text-stone-900 min-h-[85vh] flex items-center pt-8 pb-16 islamic-pattern border-b border-stone-100">
      
      {/* Golden Arabic Geometric Pattern Background Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.08)_0%,_transparent_75%)]" />
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="islamic-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="1" />
              <circle cx="30" cy="30" r="4" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      {/* Radiant Glow Lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gold-500/5 blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-gold-600/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gold-500/30 bg-gold-500/5 text-[11px] font-bold text-gold-600 font-sans uppercase tracking-[0.2em]"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>
                {language === 'en' ? 'Exquisite Islamic Fragrances' : '১০০% অ্যালকোহল মুক্ত প্রিমিয়াম সুন্নাহ আতর'}
              </span>
            </motion.div>

            {/* Main Catchy Headings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="font-serif text-4xl sm:text-5xl xl:text-7xl font-light tracking-tight leading-[1.1] text-stone-900">
                {language === 'en' ? websiteSettings.heroTitleEn : websiteSettings.heroTitleBn}
              </h1>
              <p className="text-stone-600 text-sm sm:text-base font-light max-w-xl leading-relaxed">
                {language === 'en' ? websiteSettings.heroDescEn : websiteSettings.heroDescBn}
              </p>
            </motion.div>

            {/* Core Benefits Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full pt-4 border-t border-stone-200/60"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                  {language === 'en' ? 'Purity' : 'পবিত্রতা'}
                </span>
                <span className="text-xs font-semibold text-gold-600 font-sans">
                  {language === 'en' ? 'Alcohol Free' : 'অ্যালকোহল মুক্ত'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                  {language === 'en' ? 'Longevity' : 'স্থায়িত্ব'}
                </span>
                <span className="text-xs font-semibold text-gold-600 font-sans">
                  {language === 'en' ? '12hr+ Sillage' : '১২ ঘণ্টা+ স্থায়ী'}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                  {language === 'en' ? 'Origin' : 'উৎস'}
                </span>
                <span className="text-xs font-semibold text-gold-600 font-sans">
                  {language === 'en' ? 'Saudi & Indian Ouds' : 'সৌদি ও ইন্ডিয়ান উদ'}
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 w-full pt-4"
            >
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-10 py-4 bg-gold-500 hover:brightness-110 text-black text-[12px] font-bold uppercase tracking-widest rounded-sm transition-all shadow-lg shadow-gold-500/10 cursor-pointer font-sans"
              >
                {language === 'en' ? 'Shop Collection' : 'এখনই কেনাকাটা করুন'}
              </button>
              <button
                onClick={onFlashSale}
                className="w-full sm:w-auto px-10 py-4 border border-stone-250 text-stone-800 text-[12px] font-bold uppercase tracking-widest rounded-sm bg-stone-50 hover:bg-stone-100 transition-all cursor-pointer font-sans"
              >
                {language === 'en' ? 'Flash Sale' : 'বিশেষ ছাড় অফার'}
              </button>
            </motion.div>

          </div>

          {/* Hero Right Media Panel */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[400px]">
            
            {/* Spinning Mandala Glow background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-dashed border-gold-500/20 flex items-center justify-center"
            >
              <div className="w-56 h-56 rounded-full border border-dashed border-gold-500/10" />
            </motion.div>

            {/* Glowing Golden Ring */}
            <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-gold-500/5 to-transparent shadow-[inset_0_0_50px_rgba(212,175,55,0.05)] border border-gold-500/10 blur-sm" />

            {/* Premium Perfume Bottle Container with Hover Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, type: 'spring' }}
              className="relative z-10 w-64 h-80 flex items-center justify-center drop-shadow-[0_25px_50px_rgba(212,175,55,0.1)] hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              {/* Fallback mock bottle from Design HTML for super immersive rendering */}
              <div className="relative w-56 h-80">
                {/* Cap */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-gradient-to-b from-gold-400 via-gold-600 to-gold-800 rounded-t-lg border-b border-black/30 shadow-2xl"></div>
                {/* Neck */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-20 h-3 bg-gold-500 shadow-inner"></div>
                {/* Bottle Body */}
                <div className="absolute top-23 left-1/2 -translate-x-1/2 w-44 h-56 bg-stone-50/90 backdrop-blur-xl rounded-2xl border border-stone-200 shadow-2xl flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/10 to-white/10"></div>
                   <div className="relative flex flex-col items-center text-center px-4">
                     <span className="text-[9px] uppercase tracking-[0.4em] text-stone-500 mb-1">MIFTA</span>
                     <span className="text-xl font-serif tracking-[0.1em] text-stone-900 font-semibold">ROYAL OUD</span>
                     <div className="w-8 h-[1px] bg-gold-500 my-3"></div>
                     <span className="text-[8px] uppercase tracking-widest text-gold-600 font-mono">Premium Attar</span>
                   </div>
                </div>
                {/* Reflection/Glow under bottle */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-6 bg-gold-500/15 blur-xl rounded-full"></div>
              </div>
              
              {/* Luxury Arabic Text Tag Overlay */}
              <div className="absolute -bottom-2 right-2 bg-white/95 backdrop-blur-md border border-gold-500/30 px-3.5 py-1.5 rounded-sm shadow-lg">
                <span className="text-[10px] font-serif text-gold-600 tracking-widest font-extrabold uppercase">
                  العطور الفاخرة (Premium Perfume)
                </span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
