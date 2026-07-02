/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  X,
  Star,
  Heart,
  Share2,
  CheckCircle,
  Sparkles,
  Info,
  ShoppingCart,
  Send,
  Trash2,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SafeImage from './SafeImage';

interface ProductQuickViewProps {
  product: Product;
  onClose: () => void;
  onBuyNow: (p: Product, qty: number, size: string) => void;
}

export default function ProductQuickView({ product, onClose, onBuyNow }: ProductQuickViewProps) {
  const {
    language,
    toggleWishlist,
    wishlist,
    addToCart,
    addToast,
    reviews,
    addReview,
    user
  } = useApp();

  const availableSizes = React.useMemo(() => {
    if (product.sizePrices && Object.keys(product.sizePrices).length > 0) {
      const sizes = Object.keys(product.sizePrices).filter(
        (size) => product.sizePrices?.[size] !== undefined && Number(product.sizePrices[size]) > 0
      );
      if (sizes.length > 0) return sizes;
    }
    return ['3ml', '6ml', '12ml', '20ml', '30ml', '40ml', '50ml'];
  }, [product.sizePrices]);

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(() => {
    if (product.sizePrices && Object.keys(product.sizePrices).length > 0) {
      const sizes = Object.keys(product.sizePrices).filter(
        (size) => product.sizePrices?.[size] !== undefined && Number(product.sizePrices[size]) > 0
      );
      if (sizes.length > 0) {
        return sizes.includes('6ml') ? '6ml' : sizes[0];
      }
    }
    return '6ml';
  });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'benefits' | 'usage' | 'reviews'>('desc');
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transform: 'scale(1)' });

  // Reset selectedSize if product changes
  useEffect(() => {
    if (product.sizePrices && Object.keys(product.sizePrices).length > 0) {
      const sizes = Object.keys(product.sizePrices).filter(
        (size) => product.sizePrices?.[size] !== undefined && Number(product.sizePrices[size]) > 0
      );
      if (sizes.length > 0) {
        setSelectedSize(sizes.includes('6ml') ? '6ml' : sizes[0]);
        return;
      }
    }
    setSelectedSize('6ml');
  }, [product]);

  // Reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const isSaved = wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;

  // Price modifier depending on volume/size
  const getAdjustedPrice = () => {
    if (product.sizePrices && product.sizePrices[selectedSize] !== undefined && Number(product.sizePrices[selectedSize]) > 0) {
      return Number(product.sizePrices[selectedSize]);
    }
    // Fallback multipliers
    if (selectedSize === '3ml') return Math.round(product.price * 0.65);
    if (selectedSize === '12ml') return Math.round(product.price * 1.75);
    if (selectedSize === '20ml') return Math.round(product.price * 2.85);
    if (selectedSize === '30ml') return Math.round(product.price * 4.0);
    if (selectedSize === '40ml') return Math.round(product.price * 5.2);
    if (selectedSize === '50ml') return Math.round(product.price * 6.2);
    return product.price; // 6ml default
  };

  const getAdjustedOriginalPrice = () => {
    if (!product.originalPrice) return undefined;
    const currentPrice = getAdjustedPrice();
    const ratio = currentPrice / product.price;
    return Math.round(product.originalPrice * ratio);
  };

  const adjustedPrice = getAdjustedPrice();
  const adjustedOriginalPrice = getAdjustedOriginalPrice();

  // Mouse move zoom function
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)' });
  };

  // Mock share handler
  const handleShare = () => {
    const mockUrl = `${window.location.origin}/#product/${product.id}`;
    navigator.clipboard.writeText(mockUrl);
    addToast(
      {
        en: 'Product link copied to clipboard!',
        bn: 'পণ্যটির লিংক ক্লিপবোর্ডে কপি করা হয়েছে!'
      },
      'success'
    );
  };

  // Submit review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    addReview({
      productId: product.id,
      userName: user?.name || 'Anonymous Giver',
      rating: newRating,
      comment: newComment,
      verified: true
    });
    setNewComment('');
  };

  // Helper to convert numbers to Bengali digits when the active language is Bengali (BN)
  const toBengaliDigits = (num: number | string) => {
    if (language !== 'bn') return num.toString();
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (digit) => {
      const idx = englishDigits.indexOf(digit);
      return idx !== -1 ? bengaliDigits[idx] : digit;
    });
  };

  // Localized category label helper
  const getCategoryLabel = (cat: string) => {
    const mapping: Record<string, { en: string, bn: string }> = {
      arabic: { en: 'Arabic', bn: 'অ্যারাবিক' },
      oud: { en: 'Oud', bn: 'উদ' },
      floral: { en: 'Floral', bn: 'ফ্লোরাল' },
      natural: { en: 'Natural', bn: 'ন্যাচারাল' },
      gifts: { en: 'Gifts', bn: 'গিফট বক্স' }
    };
    return mapping[cat.toLowerCase()]?.[language] || cat.toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6 bg-stone-900/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-4xl bg-white text-stone-900 shadow-[0_24px_70px_rgba(0,0,0,0.15)] p-5 sm:p-8 overflow-y-auto sm:rounded-3xl border-t sm:border border-stone-100 flex flex-col scrollbar-thin"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm border border-stone-150 rounded-full hover:bg-stone-50 text-stone-600 hover:text-stone-950 hover:scale-105 shadow-md transition-all z-30"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Media Section: Multi-images and Zoom Box (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Main Interactive Zoomable Glass Container */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-square overflow-hidden rounded-2xl border border-stone-100 bg-stone-50/50 cursor-zoom-in group shadow-sm"
            >
              <SafeImage
                src={activeImage}
                alt={product.name[language]}
                style={zoomStyle}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-100 ease-out group-hover:brightness-105"
              />
            </div>

            {/* Thumbnail Selection */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 rounded-xl border overflow-hidden shrink-0 transition-all duration-200 cursor-pointer hover:scale-102 ${
                      activeImage === img ? 'border-[#e0a92a] bg-[#e0a92a]/5 shadow-sm' : 'border-stone-150 hover:border-stone-300'
                    }`}
                  >
                    <SafeImage src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Interactive Actions (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6 text-left">
            
            {/* Title, Badges, and Price */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200/40 uppercase tracking-widest font-sans">
                  {getCategoryLabel(product.category)}
                </span>
                {product.isBestSeller && (
                  <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-stone-100 text-stone-700 tracking-wider font-sans uppercase">
                    {language === 'en' ? 'BESTSELLER' : 'সেরা পণ্য'}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-950 font-sans leading-snug">
                {product.name[language]}
              </h2>

              <div className="flex items-center gap-2 bg-stone-50/50 py-1 px-2 rounded-lg border border-stone-100/80 w-fit">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-[10px] font-bold text-stone-850 font-mono">{toBengaliDigits(product.rating)}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-stone-300" />
                <span className="text-[10px] text-stone-500 font-sans">
                  {language === 'en' ? `Based on ${toBengaliDigits(productReviews.length)} reviews` : `${toBengaliDigits(productReviews.length)}টি কাস্টমার রিভিউ`}
                </span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-3xl font-extrabold text-[#e0a92a] font-mono tracking-tight">
                  ৳{toBengaliDigits(adjustedPrice)}
                </span>
                {adjustedOriginalPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono">
                    ৳{toBengaliDigits(adjustedOriginalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector for Attars / Organic Packages */}
            {product.category !== 'natural' && product.category !== 'gifts' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 tracking-wider uppercase font-sans">
                  {language === 'en' ? 'SELECT CONTAINER SIZE' : 'আকারের পরিমাণ নির্বাচন করুন'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isActive = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          addToast({
                            en: `Size selected: ${size}`,
                            bn: `পরিমাণ নির্বাচন করা হয়েছে: ${size}`
                          }, 'info');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider font-mono transition-all duration-250 cursor-pointer ${
                          isActive
                            ? 'border border-[#e0a92a] bg-amber-50/50 text-[#cc9520] shadow-sm scale-102'
                            : 'border border-stone-200 bg-white hover:border-stone-400 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Checkout Actions */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                
                {/* Quantity Editor */}
                <div className="flex items-center justify-between rounded border border-stone-200 bg-stone-50 p-0.5 h-10 w-20 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-9 flex items-center justify-center text-sm font-bold text-stone-500 hover:text-black hover:bg-stone-100 rounded transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold font-mono text-stone-850">{toBengaliDigits(quantity)}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-9 flex items-center justify-center text-sm font-bold text-stone-500 hover:text-black hover:bg-stone-100 rounded transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Primary CTA: Add To Cart */}
                <button
                  disabled={outOfStock}
                  onClick={() => addToCart(product, quantity, selectedSize)}
                  className={`flex-1 h-10 rounded text-[10px] font-bold tracking-wider font-sans uppercase flex items-center justify-center gap-1.5 shadow-sm hover:-translate-y-0.5 transition-all duration-250 cursor-pointer ${
                    outOfStock
                      ? 'bg-stone-150 border border-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-[#e0a92a] hover:bg-[#cc9520] text-white'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{language === 'en' ? 'ADD TO BAG' : 'ব্যাগ-এ যুক্ত করুন'}</span>
                </button>

                {/* Wishlist Button labeled Favorite/ফেভারিট */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`h-10 w-10 flex items-center justify-center rounded border transition-all duration-200 cursor-pointer shrink-0 ${
                    isSaved
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-stone-200 bg-white hover:border-stone-450 text-stone-600'
                  }`}
                  title={language === 'en' ? 'Favorite' : 'ফেভারিট'}
                >
                  <Heart className={`w-4 h-4 shrink-0 ${isSaved ? 'fill-current text-red-500' : 'text-stone-500'}`} />
                </button>
              </div>

              {/* Instant Checkout Link */}
              {!outOfStock && (
                <button
                  onClick={() => onBuyNow(product, quantity, selectedSize)}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-[#e0a92a] to-[#cc9520] hover:from-[#cc9520] hover:to-[#b8821a] text-white font-extrabold tracking-widest text-[11px] uppercase flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-current text-white animate-pulse" />
                  <span>{language === 'en' ? 'ORDER NOW' : 'অর্ডার করুন'}</span>
                </button>
              )}
            </div>

            {/* Info Tabs: Details, Specs, Benefits, Reviews */}
            <div className="border-t border-stone-150 pt-3">
              <div className="flex border-b border-stone-100 overflow-x-auto pb-px scrollbar-none gap-1">
                {[
                  { id: 'desc', label: { en: 'Details', bn: 'বর্ণনা' } },
                  { id: 'spec', label: { en: 'Specifications', bn: 'বৈশিষ্ট্য' } },
                  { id: 'benefits', label: { en: 'Benefits', bn: 'উপকারিতা' } },
                  { id: 'usage', label: { en: 'How to Use', bn: 'ব্যবহার বিধি' } },
                  { id: 'reviews', label: { en: `Reviews (${productReviews.length})`, bn: `রিভিউ (${productReviews.length})` } }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-3 text-[10px] font-bold tracking-wider uppercase shrink-0 transition-colors cursor-pointer border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? 'border-[#e0a92a] text-[#cc9520]'
                        : 'border-transparent text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {tab.id === 'reviews' 
                      ? (language === 'en' ? `Reviews (${toBengaliDigits(productReviews.length)})` : `রিভিউ (${toBengaliDigits(productReviews.length)})`)
                      : tab.label[language]
                    }
                  </button>
                ))}
              </div>

              {/* Tab Display Contents */}
              <div className="py-4 text-xs sm:text-sm text-stone-700 leading-relaxed min-h-[140px]">
                {activeTab === 'desc' && (
                  <p className="font-sans text-stone-600 font-medium">{product.description[language]}</p>
                )}

                {activeTab === 'spec' && (
                  <div className="grid grid-cols-2 gap-3.5">
                    {product.specifications[language].map((spec, index) => (
                      <div key={index} className="border-b border-stone-150 pb-2">
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-800 font-sans">
                          {spec.label}
                        </span>
                        <span className="text-stone-900 font-sans font-bold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'benefits' && (
                  <ul className="space-y-2">
                    {product.benefits[language].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-sans font-medium text-stone-850">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'usage' && (
                  <div className="flex gap-3 bg-stone-50 p-4 rounded-xl border border-stone-150 text-stone-700">
                    <Info className="w-5 h-5 text-amber-700 shrink-0" />
                    <p className="font-sans italic text-stone-600">{product.usage[language]}</p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Add Review Box */}
                    <form onSubmit={handleReviewSubmit} className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-150 text-left">
                      <div className="text-[10px] font-sans font-bold text-amber-800 tracking-[0.15em] uppercase">
                        {language === 'en' ? 'WRITE A REVIEW' : 'মতামত বা রিভিউ লিখুন'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-sans">{language === 'en' ? 'Rating:' : 'রেটিং:'}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              type="button"
                              key={val}
                              onClick={() => setNewRating(val)}
                              className="text-gold-500 hover:scale-110 cursor-pointer"
                            >
                              <Star className={`w-4 h-4 ${val <= newRating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={language === 'en' ? 'Share your honest feedback...' : 'আপনার সত মতামতটি লিখুন...'}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full h-11 pl-4 pr-11 rounded-lg bg-white border border-stone-250 text-xs text-stone-800 focus:outline-none focus:border-amber-500 font-sans shadow-sm"
                        />
                        <button type="submit" className="absolute right-3.5 top-3.5 text-amber-600 hover:text-amber-500 cursor-pointer">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </form>

                    {/* Reviews List */}
                    <div className="max-h-[220px] overflow-y-auto space-y-3.5 pr-1">
                      {productReviews.length === 0 ? (
                        <div className="text-center py-6 text-stone-550 text-xs font-sans">
                          {language === 'en' ? 'No reviews yet. Be the first to share your thoughts!' : 'এখনো কোনো কাস্টমার রিভিউ নেই।'}
                        </div>
                      ) : (
                        productReviews.map((rev) => (
                          <div key={rev.id} className="p-3.5 rounded-xl border border-stone-150 bg-stone-50/50 text-left space-y-1.5 shadow-sm">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-stone-850 font-sans">{rev.userName}</span>
                              <span className="text-[10px] text-stone-500 font-mono">{toBengaliDigits(rev.date)}</span>
                            </div>
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-stone-750 font-sans">{rev.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
}
