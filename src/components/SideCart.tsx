/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShoppingBag, Trash2, Tag, Gift, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SideCartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function SideCart({ isOpen, onClose, onCheckout }: SideCartProps) {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    language,
    activeCoupon,
    applyCoupon,
    removeCoupon
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping threshold
  const freeShippingThreshold = 1500;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Coupon Discount
  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * activeCoupon.discountValue) / 100);
    } else {
      discount = activeCoupon.discountValue;
    }
  }

  const shipping = subtotal === 0 ? 0 : isFreeShipping ? 0 : 80;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (couponCode.trim() === '') return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setErrorMsg(res.message[language]);
    } else {
      setCouponCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs">
      {/* Background click close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Cart Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="relative max-w-md w-full h-full bg-white border-l border-stone-200 shadow-2xl flex flex-col justify-between text-stone-900 z-10"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-600" />
            <h2 className="font-serif text-base sm:text-lg font-bold tracking-widest uppercase">
              {language === 'en' ? 'YOUR SHOPPING BAG' : 'আপনার ব্যাগ'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-sm bg-stone-50 border border-stone-200 text-[11px] font-mono font-bold text-gold-600">
              {cart.reduce((s, c) => s + c.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-sm border border-stone-200 text-stone-500 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Goal Progress */}
        {subtotal > 0 && (
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-sans font-medium">
              {isFreeShipping ? (
                <span className="text-emerald-600 font-bold">
                  🎉 {language === 'en' ? 'Alhamdulillah! You got Free Shipping.' : 'আলহামদুলিল্লাহ! আপনার ডেলিভারি ফ্রি।'}
                </span>
              ) : (
                <span className="text-stone-600">
                  {language === 'en'
                    ? `Add ৳${amountNeededForFreeShipping} more for FREE shipping!`
                    : `ফ্রি হোম ডেলিভারির জন্য আরও ৳${amountNeededForFreeShipping} কেনাকাটা করুন!`}
                </span>
              )}
              <span className="font-mono text-[11px] font-bold text-gold-600">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1 bg-stone-200 overflow-hidden rounded-sm">
              <div
                className="h-full bg-gold-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-sm border border-dashed border-gold-500/35 flex items-center justify-center bg-gold-500/5 text-gold-600 animate-pulse">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-sm font-bold text-stone-850">
                  {language === 'en' ? 'Your bag is empty' : 'আপনার ব্যাগটি খালি'}
                </h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed font-sans">
                  {language === 'en'
                    ? 'Explore our premium collections of non-alcoholic Attars to fill your spirit with peace.'
                    : 'সুন্নাহ সম্মত সুরভিত জীবনের জন্য আমাদের প্রিমিয়াম আতর কালেকশন ঘুরে দেখতে পারেন।'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-sm border border-gold-500/60 text-gold-600 bg-stone-50 hover:bg-stone-100 text-xs font-bold font-sans tracking-widest uppercase cursor-pointer"
              >
                {language === 'en' ? 'START SHOPPING' : 'কেনাকাটা শুরু করুন'}
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize || 'default'}-${idx}`}
                className="flex gap-4 p-3 rounded-sm border border-stone-200 bg-stone-50 text-left"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name[language]}
                  className="w-14 h-16 object-cover rounded-sm border border-stone-200"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1.5">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 truncate font-sans">
                        {item.product.name[language]}
                      </h4>
                      {item.selectedSize && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded-sm bg-stone-100 border border-stone-200 text-[9px] font-bold text-gold-600 font-mono">
                          {item.selectedSize}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                      className="text-stone-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Qty edit */}
                    <div className="flex items-center rounded-sm border border-stone-200 bg-white p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                        className="px-2 py-0.5 text-xs text-stone-500 hover:text-black cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                        className="px-2 py-0.5 text-xs text-stone-500 hover:text-black cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-gold-600 font-mono">
                      ৳{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Billing Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4 pb-24 md:pb-5">
            
            {/* Coupon Application Box */}
            {!activeCoupon ? (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'ENTER COUPON (e.g. SUNNAH10)' : 'কুপন কোড লিখুন'}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 rounded-sm bg-white border border-stone-200 text-xs text-stone-900 uppercase focus:outline-none focus:border-gold-500 font-sans placeholder-stone-450"
                    />
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-stone-450" />
                  </div>
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-sm bg-white hover:bg-stone-100 border border-stone-200 text-xs font-bold text-gold-600 tracking-wider uppercase cursor-pointer"
                  >
                    {language === 'en' ? 'APPLY' : 'প্রয়োগ'}
                  </button>
                </div>
                {errorMsg && (
                  <div className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-sm border border-emerald-200 bg-emerald-50 text-xs">
                <div className="flex items-center gap-2 text-emerald-850 font-bold">
                  <Gift className="w-4 h-4 text-emerald-600" />
                  <span>{activeCoupon.code} {language === 'en' ? 'Applied' : 'প্রয়োগ করা হয়েছে'}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-stone-500 hover:text-red-600 text-[10px] uppercase font-bold cursor-pointer"
                >
                  {language === 'en' ? 'Remove' : 'বাদ দিন'}
                </button>
              </div>
            )}

            {/* Calculations Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>{language === 'en' ? 'Subtotal' : 'সাবটোটাল'}</span>
                <span className="font-mono">৳{subtotal}</span>
              </div>
              {activeCoupon && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{language === 'en' ? 'Coupon Discount' : 'কুপন ডিসকাউন্ট'}</span>
                  <span className="font-mono">-৳{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>{language === 'en' ? 'Estimated Delivery' : 'ডেলিভারি চার্জ'}</span>
                <span className="font-mono">{shipping === 0 ? (language === 'en' ? 'FREE' : 'ফ্রি') : `৳${shipping}`}</span>
              </div>
              <div className="h-px bg-stone-200 my-2" />
              <div className="flex justify-between text-sm font-bold text-stone-900">
                <span>{language === 'en' ? 'Grand Total' : 'সর্বমোট মূল্য'}</span>
                <span className="text-gold-600 font-mono text-base font-bold">৳{total}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={onCheckout}
              className="w-full py-4 rounded-sm bg-gold-500 hover:brightness-110 text-black font-extrabold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 cursor-pointer"
            >
              <span>{language === 'en' ? 'PROCEED TO PROFESSIONAL CHECKOUT' : 'অর্ডার সম্পন্ন করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
}
