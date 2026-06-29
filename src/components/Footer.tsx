/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, MessageCircle, Heart, Shield } from 'lucide-react';

interface FooterProps {
  onAdminToggle: () => void;
}

export default function Footer({ onAdminToggle }: FooterProps) {
  const { language, addToast } = useApp();
  const [newsEmail, setNewsEmail] = useState('');

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim() === '') return;
    addToast(
      {
        en: 'Jazakallah! You have subscribed to our premium newsletter catalog.',
        bn: 'জাজাকাল্লাহ! আপনি আমাদের প্রিমিয়াম সুগন্ধি ক্যাটালগে সাবস্ক্রাইব করেছেন।'
      },
      'success'
    );
    setNewsEmail('');
  };

  return (
    <footer className="bg-[#040E0B] text-white border-t border-emerald-900 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Segment: Brand summary & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-emerald-900 pb-12 items-center">
          
          <div className="lg:col-span-6 space-y-4 text-left">
            <h3 className="font-serif text-xl font-bold tracking-widest text-gold-600 uppercase">
              MIFTA ATTAR HOUSE
            </h3>
            <p className="text-xs text-stone-400 font-sans max-w-md leading-relaxed">
              {language === 'en'
                ? 'Your sanctuary for elite, 100% alcohol-free premium attars and Islamic lifestyle lifestyle offerings. Dedicated to purity, sillage longevity, and Sunnah status.'
                : 'পবিত্রতা ও আভিজাত্যের বিশ্বস্ত ঠিকানা। আমরা দিচ্ছি শতভাগ খাঁটি, অ্যালকোহল মুক্ত প্রিমিয়াম সৌদি আরবিক ও ইন্ডিয়ান সুগন্ধি আতর ও অর্গানিক লাইফস্টাইল পণ্য।'}
            </p>
          </div>

          {/* Newsletter Input */}
          <div className="lg:col-span-6 space-y-3.5 text-left">
            <label className="block text-[11px] font-sans font-bold uppercase tracking-widest text-gold-600">
              {language === 'en' ? 'SUBSCRIBE FOR OFFERS & SUNNAH WISDOM' : 'ডিসকাউন্ট অফার ও নতুন আতরের আপডেট পান'}
            </label>
            <form onSubmit={handleNewsSubmit} className="relative max-w-md">
              <input
                type="email"
                required
                placeholder={language === 'en' ? 'Enter email address...' : 'আপনার ইমেইল অ্যাড্রেস লিখুন...'}
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                className="w-full h-12 pl-4 pr-12 rounded-sm bg-emerald-900/40 border border-emerald-800 text-xs focus:outline-none focus:border-gold-500 text-white placeholder-stone-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 h-8 w-8 rounded-sm bg-gold-500 hover:brightness-110 text-black flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Middle Segment: Detailed Column Grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12 text-left">
          
          {/* Col 1: Shop Collections */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-600 font-sans">
              {language === 'en' ? 'Our Collections' : 'আতর কালেকশন'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-sans">
              {[
                { en: 'Oud Collection', bn: 'উদ কালেকশন' },
                { en: 'Arabic Attar', bn: 'আরবি আতর কালেকশন' },
                { en: 'Floral Scent Collection', bn: 'ফ্লোরাল সুগন্ধি' },
                { en: 'Sporty & Fresh', bn: 'স্পোর্টি ও ফ্রেশ আতর' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-gold-500 transition-colors">
                    {language === 'en' ? item.en : item.bn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Customer Care info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-600 font-sans">
              {language === 'en' ? 'Customer Support' : 'গ্রাহক সেবা'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-sans">
              {[
                { en: 'Order Guidelines', bn: 'অর্ডার করার নিয়ম' },
                { en: 'Return Policies', bn: 'রিটার্ন পলিসি' },
                { en: 'Shipping Guidelines', bn: 'ডেলিভারি সংক্রান্ত তথ্য' },
                { en: 'Privacy Policies', bn: 'গোপনীয়তা নীতিমালা' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-gold-500 transition-colors">
                    {language === 'en' ? item.en : item.bn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Physical Showroom Location */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-600 font-sans">
              {language === 'en' ? 'Premium Showroom' : 'আমাদের শোরুম'}
            </h4>
            <div className="space-y-3 text-xs text-stone-400 font-sans leading-relaxed">
              <div className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                <span>
                  {language === 'en' 
                    ? 'Chatmohar, Pabna, Bangladesh'
                    : 'চাটমোহর, পাবনা জেলা, বাংলাদেশ'}
                </span>
              </div>
              <div className="flex gap-2 items-start">
                <Phone className="w-4 h-4 text-gold-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-stone-500 mb-0.5">
                    {language === 'en' ? 'WhatsApp / bKash / Nagad' : 'হোয়াটসঅ্যাপ / বিকাশ / নগদ'}
                  </span>
                  <a href="tel:01773915779" className="hover:text-gold-500 transition-colors text-sm font-bold">01773915779</a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Trust credentials & Admin Entry */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-600 font-sans">
              {language === 'en' ? 'Secured Seal' : 'নিরাপত্তা ও বিশ্বাস'}
            </h4>
            <div className="space-y-3 text-xs text-stone-400 font-sans">
              <p className="leading-relaxed">
                {language === 'en'
                  ? 'We accept major Bangladeshi banking channels bKash, Nagad, Rocket and Cash on Delivery.'
                  : 'আমরা ক্যাশ অন ডেলিভারিসহ বিকাশ, নগদ ও রকেটের মাধ্যমে পেমেন্ট গ্রহণ করি।'}
              </p>
              
              {/* Secret Admin trigger - Removed from footer to keep separated URL */}
              {/* 
              <button
                onClick={onAdminToggle}
                className="text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-gold-500 border border-emerald-800 hover:border-gold-500/30 bg-emerald-900 px-2.5 py-1 rounded-sm transition-colors cursor-pointer block"
              >
                {language === 'en' ? 'ADMIN ACCESS' : 'অ্যাডমিন প্যানেল'}
              </button>
              */}
            </div>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="border-t border-emerald-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <span>
              {language === 'en' 
                ? '© 2026 Mifta Attar House. Sourced with purity. Developed in love.'
                : '© ২০২৬ মিফতা আতর হাউস। পবিত্রতা ও আস্থার বিশ্বস্ত নাম।'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold">
            <a href="#" className="hover:text-stone-300">{language === 'en' ? 'TERMS' : 'শর্তাবলী'}</a>
            <span>•</span>
            <a href="#" className="hover:text-stone-300">{language === 'en' ? 'PRIVACY' : 'প্রাইভেসি'}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
