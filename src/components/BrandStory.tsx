/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, Sparkles, Award, Star, ThumbsUp, Heart } from 'lucide-react';

export default function BrandStory() {
  const { language } = useApp();

  const benefits = [
    {
      icon: <Award className="w-5 h-5 text-gold-500" />,
      title: { en: '100% Alcohol Free', bn: '১০০% অ্যালকোহল মুক্ত' },
      desc: { en: 'Our concentrated attars represent absolute organic botanical extraction matching pure Sunnah prayers.', bn: 'আমাদের প্রতিটি আতর ও পারফিউম অয়েল শতভাগ অ্যালকোহল মুক্ত এবং ইবাদতের জন্য সম্পূর্ণ নিরাপদ।' }
    },
    {
      icon: <Star className="w-5 h-5 text-gold-500" />,
      title: { en: 'Long Lasting Sillage', bn: 'অত্যন্ত দীর্ঘস্থায়ী সুবাস' },
      desc: { en: 'High concentration ensures scent particles stay deeply on fabrics for 24 to 36 hours.', bn: 'উচ্চ মাত্রার ঘনত্বের কারণে সুবাস পোশাকে ২৪ থেকে ৩৬ ঘণ্টা পর্যন্ত দীর্ঘস্থায়ী হয়।' }
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-gold-500" />,
      title: { en: 'Premium Imported Raw Materials', bn: 'আমদানিকৃত সেরা কাঁচামাল' },
      desc: { en: 'We source premium agarwood and floral extracts directly from Saudi Arabia, Taif, India, and Cambodia.', bn: 'আমরা সরাসরি সৌদি আরব, তায়েফ, কম্বোডিয়া ও ভারত থেকে বিশ্বমানের বিশুদ্ধ কাঁচামাল আমদানি করি।' }
    },
    {
      icon: <Truck className="w-5 h-5 text-gold-500" />,
      title: { en: 'Cash on Delivery (COD)', bn: 'ক্যাশ অন ডেলিভারি (COD)' },
      desc: { en: 'Pay only after holding the perfume bottle in your hand. Fast delivery across all districts of Bangladesh.', bn: 'সারাদেশে কুরিয়ার সার্ভিসের মাধ্যমে পণ্য হাতে পেয়ে মূল্য পরিশোধ করার নিরাপদ সুবিধা।' }
    }
  ];

  return (
    <section id="story" className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Core Benefits Horizontal Strip (Mobile Scrollable, Desktop Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-4 rounded-full bg-orange-50 mb-4">
                {React.cloneElement(b.icon, { className: 'w-6 h-6 text-orange-500' })}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">
                {b.title[language]}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {b.desc[language]}
              </p>
            </div>
          ))}
        </div>

        {/* Narrative Section (Optional, below features) */}
        <div className="mt-16 bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          <div className="md:w-1/2">
            <span className="block text-sm font-bold text-orange-500 uppercase tracking-wider mb-2">
              {language === 'en' ? 'About Our Products' : 'আমাদের পণ্য সম্পর্কে'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 leading-tight">
              {language === 'en' ? 'Natural, Pure, & High Quality' : 'শতভাগ প্রাকৃতিক, খাঁটি ও উচ্চমানের'}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              {language === 'en'
                ? 'We are committed to providing the purest natural products. Our items are carefully sourced and strictly monitored for quality to ensure you get the absolute best nature has to offer.'
                : 'আপনাদের সুস্বাস্থ্য নিশ্চিত করতে আমরা নিয়ে এসেছি সম্পূর্ণ প্রাকৃতিক ও বিশুদ্ধ পণ্য। সেরা মানের উপাদান সংগ্রহ থেকে শুরু করে প্যাকেজিং পর্যন্ত প্রতিটি ধাপে আমরা সর্বোচ্চ সতর্কতা বজায় রাখি।'}
            </p>
            <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-100 inline-flex">
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" referrerPolicy="no-referrer" alt="" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" referrerPolicy="no-referrer" alt="" />
              </div>
              <span className="text-xs sm:text-sm text-gray-700 font-bold">
                {language === 'en' ? 'Loved by 5,000+ happy customers' : '৫০০০+ কাস্টমারের আস্থা'}
              </span>
            </div>
          </div>
          <div className="md:w-1/2 w-full aspect-video md:aspect-square lg:aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden relative">
             <img src="https://images.unsplash.com/photo-1611078598463-22878513b632?auto=format&fit=crop&q=80&w=1000" alt="Natural products" className="w-full h-full object-cover" />
          </div>
        </div>

      </div>
    </section>
  );
}
