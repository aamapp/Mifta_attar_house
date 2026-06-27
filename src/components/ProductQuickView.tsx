/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState('6ml');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'benefits' | 'usage' | 'reviews'>('desc');
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transform: 'scale(1)' });

  // Reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const isSaved = wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;

  // Price modifier depending on volume/size
  const getAdjustedPrice = () => {
    if (selectedSize === '3ml') return Math.round(product.price * 0.65);
    if (selectedSize === '12ml') return Math.round(product.price * 1.75);
    return product.price; // 6ml default
  };

  const getAdjustedOriginalPrice = () => {
    if (!product.originalPrice) return undefined;
    if (selectedSize === '3ml') return Math.round(product.originalPrice * 0.65);
    if (selectedSize === '12ml') return Math.round(product.originalPrice * 1.75);
    return product.originalPrice;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6 bg-stone-900/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-5xl bg-white text-stone-900 shadow-2xl p-5 sm:p-8 overflow-y-auto sm:rounded-2xl border-t sm:border border-stone-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Media Section: Multi-images and Zoom Box (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Main Interactive Zoomable Glass Container */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-square overflow-hidden rounded-sm border border-stone-200 bg-stone-50 cursor-zoom-in"
            >
              <img
                src={activeImage}
                alt={product.name[language]}
                referrerPolicy="no-referrer"
                style={zoomStyle}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-100 ease-out"
              />
            </div>

            {/* Thumbnail Selection */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 rounded-sm border overflow-hidden shrink-0 transition-colors cursor-pointer ${
                      activeImage === img ? 'border-gold-500 bg-gold-500/10' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Interactive Actions (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6 text-left">
            
            {/* Title, Badges, and Price */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-sm text-[9px] font-bold bg-gold-500/10 border border-gold-500/25 text-gold-600 tracking-[0.15em] font-sans uppercase">
                  {product.category.toUpperCase()}
                </span>
                {product.isBestSeller && (
                  <span className="px-3 py-1 rounded-sm text-[9px] font-bold bg-gold-50 text-black tracking-[0.15em] font-sans uppercase">
                    {language === 'en' ? 'BESTSELLER' : 'সেরা পণ্য'}
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 leading-snug">
                {product.name[language]}
              </h2>

              <div className="flex items-center gap-3">
                {/* Rating */}
                <div className="flex items-center gap-1 bg-gold-500/10 px-2.5 py-1 rounded-sm border border-gold-500/20">
                  <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                  <span className="text-xs font-bold text-gold-600 font-mono">{product.rating}</span>
                </div>
                <span className="text-xs text-stone-500 font-sans">
                  {language === 'en' ? `Based on ${productReviews.length} customer reviews` : `${productReviews.length}টি কাস্টমার রিভিউ`}
                </span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3.5 pt-1.5">
                <span className="text-3xl font-bold text-gold-600 font-mono">
                  ৳{adjustedPrice}
                </span>
                {adjustedOriginalPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono">
                    ৳{adjustedOriginalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector for Attars / Organic Packages */}
            {product.category !== 'natural' && product.category !== 'gifts' && (
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-gold-600 tracking-[0.15em] uppercase font-sans">
                  {language === 'en' ? 'SELECT CONTAINER SIZE' : 'আকারের পরিমাণ নির্বাচন করুন'}
                </label>
                <div className="flex gap-2">
                  {['3ml', '6ml', '12ml'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        addToast({
                          en: `Size selected: ${size}`,
                          bn: `পরিমাণ নির্বাচন করা হয়েছে: ${size}`
                        }, 'info');
                      }}
                      className={`px-4.5 py-2.5 rounded-sm border text-xs font-bold tracking-wider font-mono transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-gold-500 bg-gold-500/10 text-gold-600'
                          : 'border-stone-200 hover:border-stone-400 text-stone-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Checkout Actions */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                
                {/* Quantity Editor */}
                <div className="flex items-center rounded-sm border border-stone-200 bg-stone-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-lg font-bold text-stone-500 hover:text-black"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-lg font-bold text-stone-500 hover:text-black"
                  >
                    +
                  </button>
                </div>

                {/* Primary CTA: Add To Cart */}
                <button
                  disabled={outOfStock}
                  onClick={() => addToCart(product, quantity, selectedSize)}
                  className={`flex-1 min-w-[200px] py-4 rounded-sm font-bold tracking-[0.1em] text-xs font-sans uppercase flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                    outOfStock
                      ? 'bg-stone-150 border border-stone-150 text-stone-400 cursor-not-allowed'
                      : 'bg-gold-500 hover:brightness-110 text-black shadow-gold-500/10'
                  }`}
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  <span>{language === 'en' ? 'ADD TO SHOPPING BAG' : 'ব্যাগ-এ যুক্ত করুন'}</span>
                </button>

                {/* Wishlist Icon */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-4 rounded-sm border transition-colors cursor-pointer ${
                    isSaved ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-stone-200 hover:border-stone-400 text-stone-600'
                  }`}
                >
                  <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                {/* Share Icon */}
                <button
                  onClick={handleShare}
                  className="p-4 rounded-sm border border-stone-200 hover:border-gold-500/30 text-stone-600 hover:text-gold-600 transition-colors cursor-pointer bg-stone-50"
                  title="Share Link"
                >
                  <Share2 className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Instant Checkout Link */}
              {!outOfStock && (
                <button
                  onClick={() => onBuyNow(product, quantity, selectedSize)}
                  className="w-full py-4 rounded-sm bg-gradient-to-r from-gold-600 to-gold-500 hover:brightness-110 text-black font-extrabold tracking-[0.15em] text-xs uppercase flex items-center justify-center gap-2 shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4.5 h-4.5 fill-current" />
                  <span>{language === 'en' ? 'PROCEED TO INSTANT BUY' : 'এক ক্লিকে অর্ডার করুন'}</span>
                </button>
              )}
            </div>

            {/* Info Tabs: Details, Specs, Benefits, Reviews */}
            <div className="border-t border-stone-200 pt-5">
              <div className="flex border-b border-stone-100 overflow-x-auto pb-px scrollbar-none gap-2">
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
                    className={`py-2 px-3 text-[10px] font-bold tracking-widest uppercase shrink-0 transition-colors cursor-pointer border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? 'border-gold-500 text-gold-600'
                        : 'border-transparent text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {tab.label[language]}
                  </button>
                ))}
              </div>

              {/* Tab Display Contents */}
              <div className="py-4 text-xs sm:text-sm text-stone-700 leading-relaxed min-h-[140px]">
                {activeTab === 'desc' && (
                  <p>{product.description[language]}</p>
                )}

                {activeTab === 'spec' && (
                  <div className="grid grid-cols-2 gap-3.5">
                    {product.specifications[language].map((spec, index) => (
                      <div key={index} className="border-b border-stone-150 pb-2">
                        <span className="block text-[9px] uppercase font-bold tracking-wider text-gold-600 font-sans">
                          {spec.label}
                        </span>
                        <span className="text-stone-850 font-sans font-bold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'benefits' && (
                  <ul className="space-y-2">
                    {product.benefits[language].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-sans font-medium text-stone-850">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'usage' && (
                  <div className="flex gap-3 bg-stone-50 p-4 rounded-sm border border-stone-200 text-stone-700">
                    <Info className="w-5 h-5 text-gold-600 shrink-0" />
                    <p className="font-sans italic">{product.usage[language]}</p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Add Review Box */}
                    <form onSubmit={handleReviewSubmit} className="space-y-3 p-4 bg-stone-50 rounded-sm border border-stone-200 text-left">
                      <div className="text-[10px] font-sans font-bold text-gold-600 tracking-[0.15em] uppercase">
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
                              className="text-gold-500 hover:scale-110"
                            >
                              <Star className={`w-4 h-4 ${val <= newRating ? 'fill-gold-500 text-gold-500' : 'text-stone-300'}`} />
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
                          className="w-full h-10 pl-3 pr-10 rounded-sm bg-white border border-stone-250 text-xs text-stone-800 focus:outline-none focus:border-gold-500 font-sans"
                        />
                        <button type="submit" className="absolute right-2.5 top-2.5 text-gold-500 hover:text-gold-400">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </form>

                    {/* Reviews List */}
                    <div className="max-h-[220px] overflow-y-auto space-y-3.5 pr-1">
                      {productReviews.length === 0 ? (
                        <div className="text-center py-6 text-stone-500 text-xs font-sans">
                          {language === 'en' ? 'No reviews yet. Be the first to share your thoughts!' : 'এখনো কোনো কাস্টমার রিভিউ নেই।'}
                        </div>
                      ) : (
                        productReviews.map((rev) => (
                          <div key={rev.id} className="p-3 rounded-sm border border-stone-200 bg-stone-50 text-left space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-stone-850 font-sans">{rev.userName}</span>
                              <span className="text-[10px] text-stone-500 font-mono">{rev.date}</span>
                            </div>
                            <div className="flex gap-0.5 text-gold-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-gold-500 text-gold-500' : 'text-stone-300'}`} />
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
