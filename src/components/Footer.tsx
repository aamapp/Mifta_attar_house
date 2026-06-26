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
    <footer className="bg-stone-50 text-stone-900 border-t border-stone-200 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Segment: Brand summary & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-stone-200 pb-12 items-center">
          
          <div className="lg:col-span-6 space-y-4 text-left">
            <h3 className="font-serif text-xl font-bold tracking-widest text-gold-600 uppercase">
              MIFTA ATTAR HOUSE
            </h3>
            <p className="text-xs text-stone-600 font-sans max-w-md leading-relaxed">
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
                className="w-full h-12 pl-4 pr-12 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-850"
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
            <ul className="space-y-2 text-xs text-stone-600 font-sans">
              {['Oud Collection', 'Arabic Attar', 'Floral Scent Collection', 'Sporty & Fresh'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-gold-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Customer Care info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-600 font-sans">
              {language === 'en' ? 'Customer Support' : 'গ্রাহক সেবা'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-sans">
              {['Order Guidelines', 'Return Policies', 'Shipping Guidelines', 'Privacy Policies'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-gold-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Physical Showroom Location */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-600 font-sans">
              {language === 'en' ? 'Premium Showroom' : 'আমাদের শোরুম'}
            </h4>
            <div className="space-y-3 text-xs text-stone-600 font-sans leading-relaxed">
              <div className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Shop 24, Level 3, Mifta Plaza, Chawkbazar, Dhaka-1211, Bangladesh</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-gold-600 shrink-0" />
                <a href="tel:+8801712345678" className="hover:text-gold-600 transition-colors">+880 1712-345678</a>
              </div>
            </div>
          </div>

          {/* Col 4: Trust credentials & Admin Entry */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-600 font-sans">
              {language === 'en' ? 'Secured Seal' : 'নিরাপত্তা ও বিশ্বাস'}
            </h4>
            <div className="space-y-3 text-xs text-stone-600 font-sans">
              <p className="leading-relaxed">
                We accept major Bangladeshi banking channels bKash, Nagad, Rocket and Cash on Delivery.
              </p>
              
              {/* Secret Admin trigger */}
              <button
                onClick={onAdminToggle}
                className="text-[10px] uppercase font-bold tracking-widest text-stone-500 hover:text-gold-600 border border-stone-250 hover:border-gold-500/30 bg-white px-2.5 py-1 rounded-sm transition-colors cursor-pointer block"
              >
                ADMIN ACCESS
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="border-t border-stone-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <span>© 2026 Mifta Attar House. Sourced with purity. Developed in love.</span>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold">
            <a href="#" className="hover:text-stone-700">TERMS</a>
            <span>•</span>
            <a href="#" className="hover:text-stone-700">PRIVACY</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
