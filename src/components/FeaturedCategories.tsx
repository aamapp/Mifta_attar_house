/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useApp } from '../context/AppContext';
import { Crown, Compass, Flower, Wind, Leaf, Gift } from 'lucide-react';

interface FeaturedCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
}

export default function FeaturedCategories({ onSelectCategory }: FeaturedCategoriesProps) {
  const { categories, language } = useApp();

  // Helper to resolve the correct Lucide icon component
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-6 h-6 text-gold-500" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-gold-500" />;
      case 'Flower':
        return <Flower className="w-6 h-6 text-gold-500" />;
      case 'Wind':
        return <Wind className="w-6 h-6 text-gold-500" />;
      case 'Leaf':
        return <Leaf className="w-6 h-6 text-gold-500" />;
      case 'Gift':
        return <Gift className="w-6 h-6 text-gold-500" />;
      default:
        return <Crown className="w-6 h-6 text-gold-500" />;
    }
  };

  return (
    <section className="py-16 bg-white text-stone-900 border-b border-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.15em] text-gold-600 uppercase">
            {language === 'en' ? 'Exquisite Collections' : 'আমাদের কালেকশন সমূহ'}
          </h2>
          <div className="h-0.5 w-20 bg-gold-500 mx-auto mt-3 mb-4" />
          <p className="text-stone-600 text-sm font-sans">
            {language === 'en' 
              ? 'Select from our tailored premium categories crafted to bring deep spiritual peace and elite status.'
              : 'ইসলামী ঐতিহ্যের ছোঁয়ায় তৈরি প্রিমিয়াম আতর, সুগন্ধি, সুন্নাহ গিফট এবং অর্গানিক স্বাস্থ্যের সেরা পণ্য বেছে নিন।'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group relative h-48 rounded-sm overflow-hidden border border-stone-200 hover:border-gold-500/40 bg-stone-50 cursor-pointer shadow-sm transition-all flex flex-col justify-end p-4"
              id={`category-card-${category.id}`}
            >
              {/* background image overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={category.image}
                  alt={category.name[language]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
              </div>

              {/* Icon Container */}
              <div className="absolute top-4 left-4 z-10 p-2 rounded-sm bg-white border border-stone-200 group-hover:border-gold-500/30 transition-colors shadow-sm">
                {renderIcon(category.icon)}
              </div>

              {/* Info Overlay */}
              <div className="relative z-10 space-y-1">
                <h3 className="font-serif text-sm font-bold text-stone-900 group-hover:text-gold-600 transition-colors">
                  {category.name[language]}
                </h3>
                <p className="text-[10px] text-stone-600 font-sans line-clamp-2 leading-normal group-hover:text-stone-900 transition-colors">
                  {category.description[language]}
                </p>
              </div>

              {/* Glowing Bottom Border */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
