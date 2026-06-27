/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Star, Heart, Eye, ShoppingCart, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  key?: any;
}

export default function ProductCard({ product, onQuickView, onBuyNow }: ProductCardProps) {
  const { language, toggleWishlist, wishlist, addToCart } = useApp();

  const isSaved = wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      className="group relative flex flex-col h-full rounded bg-white border border-gray-100 hover:border-orange-500/50 transition-all overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
        {product.isBestSeller && (
          <span className="px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1 rounded bg-red-500 text-white font-sans shadow-sm">
            <Zap className="w-2.5 h-2.5 fill-white" />
            {language === 'en' ? 'Best Selling' : 'বেস্ট সেলিং'}
          </span>
        )}
      </div>

      {/* Image Preview Container */}
      <div
        onClick={() => onQuickView(product)}
        className="relative pt-[100%] overflow-hidden bg-gray-50 cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.name[language]}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
        />
        
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="px-3 py-1 rounded bg-red-50 text-xs font-bold text-red-600 border border-red-200 uppercase tracking-wider">
              {language === 'en' ? 'OUT OF STOCK' : 'স্টক শেষ'}
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3 bg-white border-t border-gray-50">
        <div className="space-y-1">
          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-sans text-sm font-semibold text-gray-900 group-hover:text-orange-500 transition-colors cursor-pointer line-clamp-2 leading-tight min-h-[2.5rem]"
          >
            {product.name[language]}
          </h3>

          {/* Pricing */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm font-bold text-orange-500 font-mono">
              ৳{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through font-mono">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
          
          {/* Save Tag */}
          {product.originalPrice && (
            <div className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-semibold font-sans">
              {language === 'en' ? 'Save' : 'সেইভ'} ৳{product.originalPrice - product.price}
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={() => onBuyNow(product)}
            disabled={outOfStock}
            className={`w-full py-2 px-3 text-xs font-semibold rounded transition-all font-sans flex items-center justify-center gap-2 cursor-pointer border ${
              outOfStock
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border-orange-500 text-orange-500 hover:bg-orange-50 active:bg-orange-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{language === 'en' ? 'Add To Cart' : 'কার্টে যোগ করুন'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
