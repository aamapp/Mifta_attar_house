/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface HeroProps {
  onExplore: () => void;
  onFlashSale: () => void;
}

const images = [
  {
    url: "/src/assets/images/luxury_attar_hero_1782537027698.jpg",
    titleEn: "Premium Attar Collection",
    titleBn: "প্রিমিয়াম আতর কালেকশন",
    subtitleEn: "Pure & Long Lasting",
    subtitleBn: "শতভাগ খাঁটি ও দীর্ঘস্থায়ী"
  },
  {
    url: "/src/assets/images/perfume_banner_wide_1782537825797.jpg",
    titleEn: "Luxury Fragrances",
    titleBn: "বিলাসবহুল সুগন্ধি",
    subtitleEn: "Imported from Dubai",
    subtitleBn: "দুবাই থেকে আমদানিকৃত"
  },
  {
    url: "/src/assets/images/floral_collection_category_1782537092479.jpg",
    titleEn: "Floral Extracts",
    titleBn: "ফ্লোরাল নির্যাস",
    subtitleEn: "Essence of Nature",
    subtitleBn: "প্রকৃতির সতেজ সুবাস"
  },
  {
    url: "/src/assets/images/oud_collection_category_1782537041918.jpg",
    titleEn: "Royal Oud Collection",
    titleBn: "রয়্যাল উদ কালেকশন",
    subtitleEn: "The King of Fragrances",
    subtitleBn: "সুগন্ধির রাজা"
  }
];

export default function Hero({ onExplore, onFlashSale }: HeroProps) {
  const { language } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="w-full bg-white pb-4 pt-1">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        
        {/* Banner Container - Slimmer height but slightly taller than before */}
        <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px] overflow-hidden rounded-xl shadow-md cursor-pointer group" onClick={onExplore}>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img 
                src={images[currentIndex].url} 
                alt={language === 'en' ? images[currentIndex].titleEn : images[currentIndex].titleBn}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Glassmorphism Overlay - Slim and Transparent */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent flex items-center px-4 sm:px-8 md:px-12">
                <div className="max-w-[75%] sm:max-w-md backdrop-blur-md bg-white/10 p-3 sm:p-5 rounded-xl border border-white/20 shadow-xl">
                  <motion.h2 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white text-base sm:text-2xl md:text-3xl font-extrabold leading-tight"
                  >
                    {language === 'en' ? images[currentIndex].titleEn : images[currentIndex].titleBn}
                  </motion.h2>
                  <motion.p 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/80 text-[10px] sm:text-xs md:text-sm font-medium mt-0.5 sm:mt-1"
                  >
                    {language === 'en' ? images[currentIndex].subtitleEn : images[currentIndex].subtitleBn}
                  </motion.p>
                  
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-2 sm:mt-4"
                  >
                    <span className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-[10px] sm:text-xs font-bold py-1 sm:py-1.5 px-3 sm:px-5 rounded-full transition-all transform active:scale-95">
                      {language === 'en' ? 'Shop Now' : 'আজই অর্ডার করুন'}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicator Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white w-4 sm:w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows (Desktop) */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-black/40"
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }}
          >
            ←
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-black/40"
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); }}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
