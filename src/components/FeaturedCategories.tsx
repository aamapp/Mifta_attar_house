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
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {language === 'en' ? 'Featured Categories' : 'ফিচার্ড ক্যাটাগরি'}
          </h2>
        </div>

        {/* Categories Flex Container */}
        <div className="relative">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory px-2 justify-start md:justify-center">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="group flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-start"
                id={`category-card-${category.id}`}
              >
                {/* Image Container */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 hover:bg-gray-100 rounded-3xl overflow-hidden shadow-sm transition-colors flex items-center justify-center p-3 relative">
                  <img
                    src={category.image}
                    alt={category.name[language]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                  />
                  {/* Overlay for icon if needed, but we'll stick to images primarily */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-3xl" />
                </div>

                {/* Info Overlay */}
                <div className="text-center w-24 sm:w-32">
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1">
                    {category.name[language]}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
