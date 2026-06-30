/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle,
  Copy,
  Info,
  ShieldAlert,
  ArrowLeft,
  DollarSign,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';

import SmartSelect from './SmartSelect';
import { locationData } from '../lib/locationData';

const BkashIcon = ({ className = "w-7 h-7" }: { className?: string }) => {
  const [hasError, setHasError] = useState(false);
  return !hasError ? (
    <img 
      src="https://www.logo.wine/a/logo/BKash/BKash-Icon2-Logo.wine.svg" 
      alt="bKash" 
      className={`${className} object-contain shrink-0`} 
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  ) : (
    <svg viewBox="0 0 100 100" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#E2136E"/>
      <path d="M72.5 35.8L51.8 56.5H72.5V35.8Z" fill="white" fillOpacity="0.9"/>
      <path d="M47.2 30.5L34.1 43.6L51.8 43.6L47.2 30.5Z" fill="white"/>
      <path d="M34.1 43.6L19.5 58.2H43.6L34.1 43.6Z" fill="white" fillOpacity="0.8"/>
      <path d="M51.8 43.6H34.1L43.6 53.1L51.8 43.6Z" fill="white" fillOpacity="0.95"/>
      <path d="M51.8 56.5L62.3 67L72.5 56.5H51.8Z" fill="white" fillOpacity="0.85"/>
      <path d="M51.8 43.6L51.8 56.5L72.5 56.5L51.8 43.6Z" fill="white"/>
    </svg>
  );
};

const NagadIcon = ({ className = "w-8 h-8" }: { className?: string }) => {
  const [hasError, setHasError] = useState(false);
  return !hasError ? (
    <img 
      src="https://www.logo.wine/a/logo/Nagad/Nagad-Vertical-Logo.wine.svg" 
      alt="Nagad" 
      className={`${className} object-contain shrink-0`} 
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  ) : (
    <svg viewBox="0 0 100 100" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#FFFFFF"/>
      <rect width="100" height="100" rx="22" stroke="#F15A24" strokeWidth="2" fill="none"/>
      <defs>
        <linearGradient id="nagadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F58220" />
          <stop offset="100%" stopColor="#EE1C24" />
        </linearGradient>
      </defs>
      <path d="M50 15C30.7 15 15 30.7 15 50C15 69.3 30.7 85 50 85C69.3 85 85 69.3 85 50C85 41.2 81.7 33.1 76.4 27C71.3 32 68 39.1 68 47C68 56.9 59.9 65 50 65C40.1 65 32 56.9 32 47C32 37.1 40.1 29 50 29C54.4 29 58.4 30.6 61.5 33.2C65.5 28.5 70.3 22.8 74.8 18.5C67.8 16.3 59.5 15 50 15Z" fill="url(#nagadGrad)"/>
      <circle cx="50" cy="47" r="8" fill="#F58220"/>
    </svg>
  );
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directProduct?: {
    product: any;
    quantity: number;
    size: string;
  };
}

export default function CheckoutModal({ isOpen, onClose, directProduct }: CheckoutModalProps) {
  const {
    cart,
    placeOrder,
    language,
    activeCoupon,
    addToast
  } = useApp();

  const [step, setStep] = useState<'info' | 'payment_process' | 'success'>('info');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    division: '',
    upazila: '',
    deliveryOption: 'outside', // 'dhaka' or 'outside'
    paymentOption: 'cod' // 'cod', 'bkash', 'nagad'
  });

  // Online simulated payment state
  const [mfsNumber, setMfsNumber] = useState('');
  const [mfsOtp, setMfsOtp] = useState('');
  const [mfsPin, setMfsPin] = useState('');
  const [paymentSubstep, setPaymentSubstep] = useState<'number' | 'otp' | 'pin'>('number');

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [manualTxId, setManualTxId] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState(0); // 0 = Only Delivery, 1 = Full Amount, 2 = Custom
  const [customAdvanceAmount, setCustomAdvanceAmount] = useState('');
  const [hasPaidAdvance, setHasPaidAdvance] = useState(false);

  const handleClose = () => {
    setStep('info');
    setFormData({
      name: '',
      phone: '',
      address: '',
      district: '',
      division: '',
      upazila: '',
      deliveryOption: 'outside',
      paymentOption: 'cod'
    });
    setMfsNumber('');
    setMfsOtp('');
    setMfsPin('');
    setPaymentSubstep('number');
    setCompletedOrder(null);
    setManualTxId('');
    setAdvanceAmount(0);
    setHasPaidAdvance(false);
    onClose();
  };

  if (!isOpen) return null;

  // Compute values
  const isDirect = !!directProduct;
  const itemsToCheckout = isDirect
    ? [{ product: directProduct!.product, quantity: directProduct!.quantity, selectedSize: directProduct!.size }]
    : cart;

  const subtotal = itemsToCheckout.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * activeCoupon.discountValue) / 100);
    } else {
      discount = activeCoupon.discountValue;
    }
  }

  const isFreeShipping = subtotal >= 1500 && formData.deliveryOption === 'dhaka';
  const shipping = subtotal === 0 ? 0 : isFreeShipping ? 0 : (formData.deliveryOption === 'dhaka' ? 80 : 160);
  const total = subtotal - discount + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'division') {
      const isDhaka = value.toLowerCase() === 'dhaka';
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value, 
        district: '', 
        upazila: '',
        deliveryOption: isDhaka ? 'dhaka' : 'outside'
      }));
    } else if (name === 'district') {
      const isDhakaDistrict = value.toLowerCase() === 'dhaka';
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value, 
        upazila: '',
        deliveryOption: isDhakaDistrict ? 'dhaka' : prev.deliveryOption
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProceedToOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() === '' || formData.phone.trim() === '' || formData.address.trim() === '') {
      addToast(
        { en: 'Please fill out all required shipping fields.', bn: 'অনুগ্রহ করে সকল আবশ্যক তথ্য পূরণ করুন।' },
        'error'
      );
      return;
    }

    // Smart pre-selection of advance paid amount:
    // If Cash on Delivery, they only pay the delivery charge in advance.
    // If bKash or Nagad, they pay the full amount in advance.
    if (formData.paymentOption === 'cod') {
      setAdvanceAmount(0);
    } else {
      setAdvanceAmount(1);
    }

    // Go to payment step to show mandatory delivery charge instructions
    setStep('payment_process');
  };

  const handleConfirmManualPayment = () => {
    if (manualTxId.trim().length < 4) {
      addToast(
        { en: 'Please enter a valid Transaction ID.', bn: 'অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি দিন।' },
        'error'
      );
      return;
    }

    if (!hasPaidAdvance) {
      addToast(
        { en: 'Please confirm you have sent the payment.', bn: 'অনুগ্রহ করে পেমেন্ট করেছেন তা নিশ্চিত করুন।' },
        'error'
      );
      return;
    }

    const order = placeOrder({
      ...formData,
      transactionId: manualTxId,
      advancePaidAmount: advanceAmount === 0 ? shipping : advanceAmount === 1 ? total : (parseFloat(customAdvanceAmount) || 0)
    }, itemsToCheckout);
    setCompletedOrder(order);
    setStep('success');
  };

  const copyOrderTracking = () => {
    if (!completedOrder) return;
    navigator.clipboard.writeText(completedOrder.id);
    addToast(
      { en: 'Order ID copied!', bn: 'অর্ডার আইডি কপি করা হয়েছে!' },
      'success'
    );
  };

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    addToast(
      { en: 'Number copied!', bn: 'নম্বর কপি করা হয়েছে!' },
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6 bg-stone-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-4xl bg-white text-stone-900 shadow-2xl p-5 sm:p-8 pb-24 sm:pb-8 overflow-y-auto sm:rounded-xl border-t sm:border border-stone-200">
        
        {/* Close button */}
        {step !== 'success' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Step 1: Shipping and Payment Configuration */}
        {step === 'info' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                <ShoppingBag className="w-6 h-6 text-gold-600" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900 uppercase tracking-tight">
                  {language === 'en' ? 'Checkout' : 'অর্ডার সম্পন্ন করুন'}
                </h2>
                <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">
                  {language === 'en' ? 'Professional Billing Service' : 'পেশাদার বিলিং ও ডেলিভারি সেবা'}
                </p>
              </div>
            </div>

            <form onSubmit={handleProceedToOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Shipping info form - 7 Columns */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-sans text-[10px] font-bold tracking-[0.15em] text-gold-600 uppercase">
                  {language === 'en' ? 'Shipping Destination' : 'ডেলিভারি ঠিকানা ও তথ্য'}
                </h3>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider mb-1">
                      {language === 'en' ? 'Full Name *' : 'পূর্ণ নাম *'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-stone-950 text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider mb-1">
                      {language === 'en' ? 'Active Phone Number *' : 'সক্রিয় মোবাইল নম্বর *'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-stone-950 text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider mb-1">
                      {language === 'en' ? 'Delivery Area Address *' : 'বিস্তারিত ঠিকানা *'}
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="e.g. Road, House, Sector/Vill..."
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-stone-950 text-sm focus:outline-none focus:border-gold-500 placeholder-stone-400"
                    />
                  </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <SmartSelect
                        label={language === 'en' ? 'Division' : 'বিভাগ'}
                        value={formData.division}
                        onChange={(val) => handleInputChange({ target: { name: 'division', value: val } } as any)}
                        options={[
                          { value: '', label: language === 'en' ? '-- Select --' : '-- সিলেক্ট করুন --' },
                          ...Object.entries(locationData.divisions).map(([key, div]) => ({
                            value: key,
                            label: language === 'en' ? div.en : div.bn
                          }))
                        ]}
                      />
                      <SmartSelect
                        label={language === 'en' ? 'District' : 'জেলা'}
                        disabled={!formData.division}
                        value={formData.district}
                        onChange={(val) => handleInputChange({ target: { name: 'district', value: val } } as any)}
                        options={[
                          { value: '', label: language === 'en' ? '-- Select --' : '-- সিলেক্ট করুন --' },
                          ...(formData.division && locationData.divisions[formData.division]
                            ? Object.entries(locationData.divisions[formData.division].districts).map(([key, dist]) => ({
                                value: key,
                                label: language === 'en' ? dist.en : dist.bn
                              }))
                            : [])
                        ]}
                      />
                      <SmartSelect
                        label={language === 'en' ? 'Upazila' : 'উপজেলা'}
                        disabled={!formData.district}
                        value={formData.upazila}
                        onChange={(val) => handleInputChange({ target: { name: 'upazila', value: val } } as any)}
                        options={[
                          { value: '', label: language === 'en' ? '-- Select --' : '-- সিলেক্ট করুন --' },
                          ...(formData.division && formData.district && locationData.divisions[formData.division]?.districts[formData.district]
                            ? (locationData.divisions[formData.division].districts[formData.district].upazilas || []).map((up) => ({
                                value: up.en,
                                label: language === 'en' ? up.en : up.bn
                              }))
                            : [])
                        ]}
                      />
                    </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Delivery Options */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider">
                        {language === 'en' ? 'Delivery Speed' : 'ডেলিভারি এরিয়া'}
                      </label>
                      <div className="flex flex-col gap-2">
                        <label className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-colors ${formData.deliveryOption === 'dhaka' ? 'border-gold-500 bg-gold-500/5' : 'border-stone-200 hover:border-stone-400 bg-stone-50'}`}>
                          <input
                            type="radio"
                            name="deliveryOption"
                            value="dhaka"
                            checked={formData.deliveryOption === 'dhaka'}
                            onChange={handleInputChange}
                            className="text-gold-500 focus:ring-0"
                          />
                          <div className="text-xs">
                            <span className="font-bold block text-stone-900">{language === 'en' ? 'Dhaka (৳80)' : 'ঢাকার ভিতরে (৳৮০)'}</span>
                            <span className="text-stone-500">{language === 'en' ? '1-2 Days Delivery' : '১-২ দিনে ডেলিভারি'}</span>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-colors ${formData.deliveryOption === 'outside' ? 'border-gold-500 bg-gold-500/5' : 'border-stone-200 hover:border-stone-400 bg-stone-50'}`}>
                          <input
                            type="radio"
                            name="deliveryOption"
                            value="outside"
                            checked={formData.deliveryOption === 'outside'}
                            onChange={handleInputChange}
                            className="text-gold-500 focus:ring-0"
                          />
                          <div className="text-xs">
                            <span className="font-bold block text-stone-900">{language === 'en' ? 'Outside Dhaka (৳160)' : 'ঢাকার বাইরে (৳১৬০)'}</span>
                            <span className="text-stone-500">{language === 'en' ? '3-5 Days Delivery' : '৩-৫ দিনে ডেলিভারি'}</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Payment Options */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider">
                        {language === 'en' ? 'Payment Method' : 'পেমেন্ট পদ্ধতি'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'cod', label: language === 'en' ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি', desc: language === 'en' ? 'Pay on receive' : 'পণ্য হাতে পেয়ে টাকা দিন', icon: <div className="w-14 h-14 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 mb-1"><DollarSign className="w-7 h-7 text-emerald-500" /></div> },
                          { 
                            id: 'bkash', 
                            label: language === 'en' ? 'bKash Wallet' : 'বিকাশ পেমেন্ট', 
                            desc: language === 'en' ? 'Secure online pay' : 'অনলাইন পেমেন্ট',
                            icon: <BkashIcon className="w-14 h-14 rounded-lg" />
                          },
                          { 
                            id: 'nagad', 
                            label: language === 'en' ? 'Nagad Pay' : 'নগদ পেমেন্ট', 
                            desc: language === 'en' ? 'Secure online pay' : 'অনলাইন পেমেন্ট',
                            icon: <NagadIcon className="w-14 h-14 rounded-lg" />
                          }
                        ].map((pay) => (
                          <label
                            key={pay.id}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-sm border cursor-pointer transition-all gap-1.5 ${formData.paymentOption === pay.id ? 'border-gold-500 bg-gold-500/5 shadow-md shadow-gold-500/5' : 'border-stone-200 hover:border-stone-400 bg-stone-50'}`}
                          >
                            <input
                              type="radio"
                              name="paymentOption"
                              value={pay.id}
                              checked={formData.paymentOption === pay.id}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            {pay.icon}
                            <span className="text-[10px] font-bold text-stone-700 font-sans text-center">{pay.label}</span>
                            <span className="text-[8px] text-stone-500 font-medium text-center leading-none mt-[-2px]">{pay.desc}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary sidebar - 5 Columns */}
              <div className="lg:col-span-5 p-5 rounded-sm border border-stone-200 bg-stone-50 space-y-4">
                <h3 className="font-sans text-[10px] font-bold tracking-[0.15em] text-gold-600 uppercase">
                  {language === 'en' ? 'Order Inventory' : 'ক্রয়কৃত পণ্যের তালিকা'}
                </h3>

                <div className="max-h-[220px] overflow-y-auto space-y-3">
                  {itemsToCheckout.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-xs border-b border-stone-200 pb-2.5">
                      <img src={item.product.images[0]} className="w-10 h-12 object-cover rounded-sm border border-stone-200" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-stone-900 truncate font-sans">{item.product.name[language]}</div>
                        <div className="text-stone-500 text-[10px] mt-0.5">
                          {language === 'en' ? 'Qty' : 'পরিমাণ'}: {item.quantity} {item.selectedSize ? `| ${language === 'en' ? 'Size' : 'আকার'}: ${item.selectedSize}` : ''}
                        </div>
                      </div>
                      <span className="font-bold font-mono text-gold-600">৳{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="space-y-2 text-xs border-b border-stone-200 pb-3">
                  <div className="flex justify-between text-stone-500">
                    <span>{language === 'en' ? 'Subtotal' : 'উপমোট'}</span>
                    <span className="font-mono">৳{subtotal}</span>
                  </div>
                  {activeCoupon && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>{language === 'en' ? 'Coupon Discount' : 'কুপন ছাড়'}</span>
                      <span className="font-mono">-৳{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-500">
                    <span>{language === 'en' ? 'Delivery Shipping' : 'ডেলিভারি চার্জ'}</span>
                    <span className="font-mono">৳{shipping}</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-bold text-stone-900">
                  <span>{language === 'en' ? 'Total Amount' : 'সর্বমোট মূল্য'}</span>
                  <span className="text-gold-600 font-mono text-lg font-bold">৳{total}</span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-sm bg-gold-500 hover:brightness-110 text-black font-extrabold text-xs tracking-widest uppercase shadow-xl cursor-pointer"
                >
                  {language === 'en' ? 'PROCEED TO PAYMENT' : 'পেমেন্ট ধাপে এগিয়ে যান'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Manual Payment Instructions & Verification */}
        {step === 'payment_process' && (
          <div className="max-w-2xl mx-auto py-4 text-left space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
              <button 
                onClick={() => setStep('info')}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-stone-500" />
              </button>
              <h2 className="font-serif text-xl font-bold text-stone-900 uppercase tracking-tight">
                {language === 'en' ? 'Payment Verification' : 'পেমেন্ট ভেরিফিকেশন'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instructions Card */}
              <div className="space-y-4">
                <div className="p-4 rounded-sm bg-gold-50 border border-gold-200">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-gold-900 uppercase mb-1">
                        {formData.paymentOption === 'cod' 
                          ? (language === 'en' ? 'Mandatory Delivery Charge' : 'অগ্রিম ডেলিভারি চার্জ বাধ্যতামূলক')
                          : (language === 'en' ? 'Full Payment Verification' : 'পূর্ণ মূল্য পেমেন্ট ভেরিফিকেশন')}
                      </h4>
                      <p className="text-[10px] text-gold-800 leading-relaxed">
                        {formData.paymentOption === 'cod'
                          ? (language === 'en' 
                              ? `To confirm your Cash on Delivery order, you must pay the delivery charge (৳${shipping}) in advance. The rest of the amount will be paid on delivery.`
                              : `ক্যাশ অন ডেলিভারি অর্ডার কনফার্ম করতে কমপক্ষে ডেলিভারি চার্জ (৳${shipping}) অগ্রিম প্রদান করতে হবে। বাকি টাকা পণ্য হাতে পেয়ে পরিশোধ করবেন।`)
                          : (language === 'en' 
                              ? `Please send the total order amount of ৳${total} in advance to confirm your order via bKash or Nagad.`
                              : `আপনার অর্ডারের পূর্ণ মূল্য সর্বমোট ৳${total} টাকা নিচের বিকাশ বা নগদ নাম্বারে Send Money করুন।`)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-sm border border-stone-200 bg-stone-50 space-y-4">
                  <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-stone-200 pb-2">
                    {language === 'en' ? 'Payment Numbers' : 'পেমেন্ট নাম্বারসমূহ'}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-sm bg-white border border-stone-200 group">
                      <div className="flex items-center gap-3">
                        <BkashIcon className="w-14 h-14 rounded-lg" />
                        <div>
                          <p className="text-[9px] text-stone-400 font-bold uppercase">bKash (Personal)</p>
                          <p className="text-sm font-mono font-bold text-stone-900">01773-915779</p>
                        </div>
                      </div>
                      <button onClick={() => copyNumber('01773915779')} className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-gold-600">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-sm bg-white border border-stone-200 group">
                      <div className="flex items-center gap-3">
                        <NagadIcon className="w-14 h-14 rounded-lg" />
                        <div>
                          <p className="text-[9px] text-stone-400 font-bold uppercase">Nagad (Personal)</p>
                          <p className="text-sm font-mono font-bold text-stone-900">01773-915779</p>
                        </div>
                      </div>
                      <button onClick={() => copyNumber('01773915779')} className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-gold-600">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] text-stone-500 italic">
                      {language === 'en' 
                        ? '* Use "Send Money" option from your wallet.' 
                        : '* আপনার ওয়ালেট থেকে "Send Money" অপশনটি ব্যবহার করুন।'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Form Card */}
              <div className="space-y-4">
                <div className="p-5 rounded-sm border border-stone-200 bg-white shadow-sm space-y-4">
                  <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                    {language === 'en' ? 'Payment Details' : 'পেমেন্টের তথ্য প্রদান করুন'}
                  </h3>

                  <div className="space-y-3">
                    <label className="block">
                      <span className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5">
                        {language === 'en' ? 'How much did you pay?' : 'আপনি কত টাকা পাঠিয়েছেন?'}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setAdvanceAmount(0)}
                          className={`py-2.5 px-3 rounded-sm border text-[10px] font-bold transition-all ${advanceAmount === 0 ? 'border-gold-500 bg-gold-500 text-black' : 'border-stone-200 bg-stone-50 text-stone-600'}`}
                        >
                          {language === 'en' ? `Delivery Charge (৳${shipping})` : `ডেলিভারি চার্জ (৳${shipping})`}
                        </button>
                        <button 
                          onClick={() => setAdvanceAmount(1)}
                          className={`py-2.5 px-3 rounded-sm border text-[10px] font-bold transition-all ${advanceAmount === 1 ? 'border-gold-500 bg-gold-500 text-black' : 'border-stone-200 bg-stone-50 text-stone-600'}`}
                        >
                          {language === 'en' ? `Full Amount (৳${total})` : `পূর্ণ মূল্য (৳${total})`}
                        </button>
                        <button 
                          onClick={() => setAdvanceAmount(2)}
                          className={`col-span-2 py-2.5 px-3 rounded-sm border text-[10px] font-bold transition-all ${advanceAmount === 2 ? 'border-gold-500 bg-gold-500 text-black' : 'border-stone-200 bg-stone-50 text-stone-600'}`}
                        >
                          {language === 'en' ? `Other Amount` : `অন্য পরিমাণ`}
                        </button>
                      </div>
                    </label>

                    {advanceAmount === 2 && (
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5">
                          {language === 'en' ? 'Enter Amount (৳)' : 'টাকার পরিমাণ লিখুন (৳)'}
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 500"
                          value={customAdvanceAmount}
                          onChange={(e) => setCustomAdvanceAmount(e.target.value)}
                          className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-stone-900 font-mono font-bold text-sm focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5">
                        {language === 'en' ? 'Transaction ID / Last 4 Digits' : 'ট্রানজেকশন আইডি / শেষের ৪টি সংখ্যা'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 8XJ9K2L or 4587"
                        value={manualTxId}
                        onChange={(e) => setManualTxId(e.target.value)}
                        className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-stone-900 font-mono font-bold text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group pt-2">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={hasPaidAdvance}
                          onChange={(e) => setHasPaidAdvance(e.target.checked)}
                          className="w-4 h-4 rounded border-stone-300 text-gold-500 focus:ring-gold-500"
                        />
                      </div>
                      <span className="text-[10px] text-stone-600 font-medium leading-relaxed group-hover:text-stone-900 transition-colors">
                        {language === 'en' 
                          ? 'I confirm that I have sent the advance amount and provided correct info.' 
                          : 'আমি নিশ্চিত করছি যে আমি অগ্রিম টাকা পাঠিয়েছি এবং সঠিক তথ্য প্রদান করেছি।'}
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleConfirmManualPayment}
                    className="w-full py-4 rounded-sm bg-stone-900 hover:bg-black text-white font-extrabold text-xs tracking-widest uppercase shadow-xl transition-all"
                  >
                    {language === 'en' ? 'SUBMIT ORDER FOR VERIFICATION' : 'অর্ডার ভেরিফিকেশনের জন্য পাঠান'}
                  </button>
                  
                  <p className="text-[9px] text-center text-stone-400 mt-2">
                    {language === 'en' 
                      ? 'Our team will verify the payment and confirm your order shortly.' 
                      : 'আমাদের টিম আপনার পেমেন্ট যাচাই করে শীঘ্রই অর্ডারটি কনফার্ম করবে।'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation Receipt Card */}
        {step === 'success' && completedOrder && (
          <div className="max-w-xl mx-auto text-center space-y-6 py-6 text-stone-900">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-gold-600 tracking-wider">
                {language === 'en' ? 'ALHAMDULILLAH! ORDER SUBMITTED' : 'আলহামদুলিল্লাহ! অর্ডার সাবমিট হয়েছে'}
              </h2>
              <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                {language === 'en'
                  ? 'Your order is currently under verification. Our team will verify your payment and update the status shortly.'
                  : 'আপনার অর্ডারটি বর্তমানে ভেরিফিকেশনের অধীনে রয়েছে। আমাদের টিম পেমেন্ট যাচাই করে শীঘ্রই অর্ডারের অবস্থা আপডেট করবে।'}
              </p>
            </div>

            {/* Receipt Summary details */}
            <div className="p-6 rounded-sm border border-stone-200 bg-stone-50 space-y-3.5 text-left text-stone-850">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-stone-200">
                <span className="text-stone-500 uppercase font-bold tracking-wider">{language === 'en' ? 'ORDER ID' : 'অর্ডার আইডি'}:</span>
                <button onClick={copyOrderTracking} className="flex items-center gap-1 text-gold-600 font-mono font-extrabold hover:underline cursor-pointer">
                  <span>{completedOrder.id}</span>
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-stone-700">
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'en' ? 'Recipient Name' : 'গ্রহীতার নাম'}:</span>
                  <span className="font-bold text-stone-900">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'en' ? 'Recipient Phone' : 'মোবাইল নম্বর'}:</span>
                  <span className="font-bold text-stone-900">{completedOrder.phone}</span>
                </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{language === 'en' ? 'Shipping Address' : 'ডেলিভারি ঠিকানা'}:</span>
                    <span className="font-bold text-stone-900 text-right">
                      {completedOrder.address}, {completedOrder.upazila}, {completedOrder.district}, {completedOrder.division}
                    </span>
                  </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'en' ? 'Payment Status' : 'পেমেন্ট স্ট্যাটাস'}:</span>
                  <span className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold uppercase text-[9px] tracking-wider">
                    {completedOrder.paymentStatus === 'pending' ? (language === 'en' ? 'Pending (COD)' : 'বাকি (ক্যাশ অন ডেলিভারি)') : (language === 'en' ? 'paid' : 'পরিশোধিত')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'en' ? 'Estimated Delivery' : 'সম্ভাব্য ডেলিভারি'}:</span>
                  <span className="font-bold text-emerald-600">{formData.deliveryOption === 'dhaka' ? (language === 'en' ? '1-2 Days' : '১-২ দিন') : (language === 'en' ? '3-5 Days' : '৩-৫ দিন')}</span>
                </div>
              </div>

              <div className="h-px bg-stone-200 my-2" />

              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-stone-500">{language === 'en' ? 'TOTAL PAID' : 'মোট পরিশোধিত'}:</span>
                <span className="text-gold-600 font-mono text-lg font-bold">৳{completedOrder.total}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3.5 rounded-sm bg-gold-500 hover:brightness-110 text-black font-extrabold text-xs tracking-widest uppercase cursor-pointer"
            >
              {language === 'en' ? 'CONTINUE SHOPPING' : 'কেনাকাটা চালিয়ে যান'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
