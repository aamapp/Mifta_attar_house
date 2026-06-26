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
      className="group relative flex flex-col h-full rounded-sm border border-stone-200 bg-white hover:border-gold-500/40 transition-all overflow-hidden shadow-sm hover:shadow-md"
      style={{ boxShadow: '0 4px 20px rgba(212,175,55,0.04)' }}
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isBestSeller && (
          <span className="px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] uppercase rounded-sm bg-gold-500 text-black font-sans shadow-md">
            {language === 'en' ? 'BEST SELLER' : 'সেরা বিক্রি'}
          </span>
        )}
        {product.isFlashSale && (
          <span className="px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] uppercase rounded-sm bg-red-600 text-white font-sans shadow-md animate-pulse">
            {language === 'en' ? `FLASH -${discountPercent}%` : `বিশেষ ছাড় -${discountPercent}%`}
          </span>
        )}
        {product.isNewArrival && (
          <span className="px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] uppercase rounded-sm bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-sans shadow-md">
            {language === 'en' ? 'NEW' : 'নতুন'}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-sm bg-white/90 border border-stone-200 hover:border-gold-500/30 text-stone-500 hover:text-red-500 transition-colors shadow-md cursor-pointer"
        title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Image Preview Container */}
      <div
        onClick={() => onQuickView(product)}
        className="relative pt-[115%] overflow-hidden bg-stone-100 cursor-pointer border-b border-stone-150"
      >
        <img
          src={product.images[0]}
          alt={product.name[language]}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Hover Action Overlays */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-3 rounded-sm bg-white border border-gold-500/20 text-gold-600 hover:bg-gold-500 hover:text-black transition-all transform scale-90 group-hover:scale-100 duration-300"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
          {!outOfStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1, '6ml');
              }}
              className="p-3 rounded-sm bg-gold-500 text-black hover:brightness-110 transition-all transform scale-90 group-hover:scale-100 duration-300 shadow-lg shadow-gold-500/20"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-sm border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-500 font-sans tracking-widest uppercase">
              {language === 'en' ? 'OUT OF STOCK' : 'স্টক শেষ'}
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1.5">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-gold-500">
              <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
            </div>
            <span className="text-[11px] font-bold text-stone-700 font-mono">
              {product.rating}
            </span>
            <span className="text-[10px] text-stone-400 font-sans">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-base font-bold text-stone-900 group-hover:text-gold-600 transition-colors cursor-pointer line-clamp-1 leading-snug"
          >
            {product.name[language]}
          </h3>

          {/* Stock Display */}
          <div className="text-[10px] font-sans font-medium">
            {outOfStock ? (
              <span className="text-red-500">{language === 'en' ? 'Stockout' : 'স্টক শেষ'}</span>
            ) : product.stock <= 10 ? (
              <span className="text-gold-600 font-bold">
                {language === 'en' ? `Only ${product.stock} items left!` : `মাত্র ${product.stock} পিস বাকি আছে!`}
              </span>
            ) : (
              <span className="text-emerald-600 font-bold">
                {language === 'en' ? 'In Stock' : 'স্টকে আছে'}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Primary Action Buttons */}
        <div className="space-y-3 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gold-600 font-mono">
              ৳{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through font-mono">
                ৳{product.originalPrice}
              </span>
            )}
          </div>

          {/* Direct Buy Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onQuickView(product)}
              className="w-full py-2 px-1 text-[10px] font-bold tracking-widest rounded-sm border border-stone-200 text-stone-750 hover:text-black hover:border-stone-400 bg-stone-50 transition-all font-sans uppercase flex items-center justify-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'DETAILS' : 'বিস্তারিত'}</span>
            </button>
            <button
              onClick={() => onBuyNow(product)}
              disabled={outOfStock}
              className={`w-full py-2 px-1 text-[10px] font-extrabold tracking-widest rounded-sm transition-all font-sans uppercase flex items-center justify-center gap-1 cursor-pointer ${
                outOfStock
                  ? 'bg-stone-100 border border-stone-100 text-stone-300 cursor-not-allowed'
                  : 'bg-gold-500 hover:brightness-110 text-black shadow-sm'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'en' ? 'BUY' : 'কিনুন'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
