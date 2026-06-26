/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
    <section id="story" className="py-20 bg-white text-stone-900 border-t border-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Narrative Story - 6 Columns */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <span className="block text-xs font-bold text-gold-600 uppercase tracking-widest font-sans">
                {language === 'en' ? 'OUR LEGACY' : 'আমাদের ঐতিহ্য ও গল্প'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 font-bold leading-tight tracking-wide">
                {language === 'en' ? 'Crafting Heavenly Pure Fragrances' : 'মিফতা আতর হাউসের স্বপ্ন ও পথচলা'}
              </h2>
            </div>
            
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              {language === 'en'
                ? 'Mifta Attar House was born from a desire to revive the ancient, sacred tradition of pure non-alcoholic perfumery. We believe that a fragrance is not just a cosmetic asset—it is food for the spiritual heart, an expression of clean status, and a beautiful prophetic sunnah.'
                : 'পবিত্রতা ও আভিজাত্যের চিরন্তন মেলবন্ধন ঘটাতে মিফতা আতর হাউসের যাত্রা শুরু। আমরা বিশ্বাস করি, সুগন্ধি কেবল সাজসজ্জার অংশ নয়—বরং এটি আত্মার খাদ্য, পবিত্রতা প্রকাশের মাধ্যম এবং রাসূলুল্লাহ (সাঃ)-এর অন্যতম প্রিয় সুন্নাহ। আমরা মানহীন অ্যালকোহল মিশ্রিত সুগন্ধির বিপরীতে আপনাদের হাতে তুলে দিই শতভাগ খাঁটি ও বিশুদ্ধ আতর।'}
            </p>

            <p className="text-sm text-stone-800 font-sans italic border-l-2 border-gold-500 pl-4 py-1.5 bg-stone-50">
              {language === 'en'
                ? '"Fragrance has the spiritual potency to increase focus, clear cognitive blockages, and invite celestial peace into the home environment."'
                : '"বিশুদ্ধ সুগন্ধি মনকে প্রফুল্ল রাখে, মেধা বিকাশে সাহায্য করে এবং যেকোনো সৎ ইবাদতে মনযোগ বৃদ্ধি করতে সাহায্য করে।"'}
            </p>

            <div className="flex gap-4 items-center">
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" referrerPolicy="no-referrer" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" referrerPolicy="no-referrer" />
              </div>
              <span className="text-xs text-stone-500 font-sans">
                {language === 'en' ? 'Loved by 5,000+ satisfied spiritual souls across Bangladesh' : 'সারাদেশে ৫,০০০+ সন্তুষ্ট কাস্টমারের অফুরন্ত ভালোবাসা ও বিশ্বাস'}
              </span>
            </div>
          </div>

          {/* Benefits Grid list - 6 Columns */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="p-5 rounded-sm border border-stone-200 bg-stone-50/60 hover:border-gold-500/30 hover:bg-stone-50 hover:shadow-sm text-left space-y-3 transition-all"
              >
                <div className="p-2.5 rounded-sm bg-white border border-stone-200 shadow-sm w-fit">
                  {b.icon}
                </div>
                <h3 className="font-serif text-sm font-bold text-stone-900 tracking-wide">
                  {b.title[language]}
                </h3>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">
                  {b.desc[language]}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
