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
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';

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
    name: 'Mamun Chowdhury',
    phone: '01712345678',
    address: 'House 42, Road 11, Banani',
    district: 'Dhaka',
    division: 'Dhaka',
    deliveryOption: 'dhaka', // 'dhaka' or 'outside'
    paymentOption: 'cod' // 'cod', 'bkash', 'nagad', 'rocket'
  });

  // Online simulated payment state
  const [mfsNumber, setMfsNumber] = useState('01712345678');
  const [mfsOtp, setMfsOtp] = useState('');
  const [mfsPin, setMfsPin] = useState('');
  const [paymentSubstep, setPaymentSubstep] = useState<'number' | 'otp' | 'pin'>('number');

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

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

  const shipping = formData.deliveryOption === 'dhaka' ? 60 : 120;
  const total = subtotal - discount + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() === '' || formData.phone.trim() === '' || formData.address.trim() === '') {
      addToast(
        { en: 'Please fill out all required shipping fields.', bn: 'অনুগ্রহ করে সকল আবশ্যক তথ্য পূরণ করুন।' },
        'error'
      );
      return;
    }

    if (formData.paymentOption === 'cod') {
      // Direct success for Cash on Delivery
      const order = placeOrder(formData);
      setCompletedOrder(order);
      setStep('success');
    } else {
      // Trigger MFS payment simulator
      setStep('payment_process');
      setPaymentSubstep('number');
    }
  };

  const handleSimulateMfsSubmit = () => {
    if (paymentSubstep === 'number') {
      if (mfsNumber.length < 11) {
        addToast({ en: 'Invalid wallet number.', bn: 'সঠিক ওয়ালেট নম্বর প্রদান করুন।' }, 'error');
        return;
      }
      setPaymentSubstep('otp');
      addToast(
        { en: 'OTP sent! Please enter simulated OTP (e.g., 123456)', bn: 'ওটিপি পাঠানো হয়েছে! ওটিপি লিখুন (যেমন: ১২৩৪৫৬)' },
        'info'
      );
    } else if (paymentSubstep === 'otp') {
      setPaymentSubstep('pin');
    } else {
      // Payment Completed successfully!
      const order = placeOrder({
        ...formData,
        paymentOption: formData.paymentOption
      });
      setCompletedOrder(order);
      setStep('success');
    }
  };

  const copyOrderTracking = () => {
    if (!completedOrder) return;
    navigator.clipboard.writeText(completedOrder.id);
    addToast(
      { en: 'Order ID copied!', bn: 'অর্ডার আইডি কপি করা হয়েছে!' },
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative max-w-4xl w-full rounded-sm border border-stone-200 bg-white text-stone-900 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close button */}
        {step !== 'success' && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-sm border border-stone-200 bg-stone-50 text-stone-500 hover:text-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Step 1: Shipping and Payment Configuration */}
        {step === 'info' && (
          <div className="space-y-6 text-left">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gold-600 uppercase tracking-widest">
                {language === 'en' ? 'PROFESSIONAL CHECKOUT' : 'পেশাদার চেকআউট ফর্ম'}
              </h2>
              <div className="h-[1px] w-16 bg-gold-500 mt-2" />
            </div>

            <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider mb-1">
                        {language === 'en' ? 'District' : 'জেলা'}
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full h-11 px-4 rounded-sm bg-stone-50 border border-stone-200 text-stone-950 text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider mb-1">
                        {language === 'en' ? 'Division' : 'বিভাগ'}
                      </label>
                      <select
                        name="division"
                        value={formData.division}
                        onChange={handleInputChange}
                        className="w-full h-11 px-3 rounded-sm bg-stone-50 border border-stone-200 text-stone-950 text-sm focus:outline-none focus:border-gold-500"
                      >
                        {[
                          { val: 'Dhaka', en: 'Dhaka', bn: 'ঢাকা' },
                          { val: 'Chattogram', en: 'Chattogram', bn: 'চট্টগ্রাম' },
                          { val: 'Sylhet', en: 'Sylhet', bn: 'সিলেট' },
                          { val: 'Rajshahi', en: 'Rajshahi', bn: 'রাজশাহী' },
                          { val: 'Khulna', en: 'Khulna', bn: 'খুলনা' },
                          { val: 'Barishal', en: 'Barishal', bn: 'বরিশাল' },
                          { val: 'Rangpur', en: 'Rangpur', bn: 'রংপুর' },
                          { val: 'Mymensingh', en: 'Mymensingh', bn: 'ময়মনসিংহ' }
                        ].map((div) => (
                          <option key={div.val} value={div.val}>{language === 'en' ? div.en : div.bn}</option>
                        ))}
                      </select>
                    </div>
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
                            <span className="font-bold block text-stone-900">{language === 'en' ? 'Dhaka (৳60)' : 'ঢাকার ভিতরে (৳৬০)'}</span>
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
                            <span className="font-bold block text-stone-900">{language === 'en' ? 'Outside Dhaka (৳120)' : 'ঢাকার বাইরে (৳১২০)'}</span>
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
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'cod', label: language === 'en' ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি', icon: <DollarSign className="w-4 h-4 text-emerald-500" /> },
                          { id: 'bkash', label: language === 'en' ? 'bKash Wallet' : 'বিকাশ পেমেন্ট', icon: <div className="font-bold text-pink-500 text-xs">bKash</div> },
                          { id: 'nagad', label: language === 'en' ? 'Nagad Pay' : 'নগদ পেমেন্ট', icon: <div className="font-bold text-orange-500 text-xs">Nagad</div> },
                          { id: 'rocket', label: language === 'en' ? 'Rocket' : 'রকেট পেমেন্ট', icon: <div className="font-bold text-purple-500 text-xs">Rocket</div> }
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
                            <span className="text-[10px] font-bold text-stone-700 font-sans">{pay.label}</span>
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
                  {formData.paymentOption === 'cod'
                    ? (language === 'en' ? 'CONFIRM ORDER (COD)' : 'অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি)')
                    : (language === 'en' ? `PAY WITH ${formData.paymentOption.toUpperCase()}` : `${formData.paymentOption.toUpperCase()}-এ পেমেন্ট করুন`)}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Interactive MFS simulated Gateway */}
        {step === 'payment_process' && (
          <div className="max-w-md mx-auto py-8 text-center space-y-6">
            
            {/* Custom Header matching active MFS */}
            <div className={`p-4 rounded-sm border text-white font-bold tracking-widest uppercase ${
              formData.paymentOption === 'bkash' ? 'bg-pink-600 border-pink-500' :
              formData.paymentOption === 'nagad' ? 'bg-orange-600 border-orange-500' :
              'bg-purple-600 border-purple-500'
            }`}>
              {formData.paymentOption.toUpperCase()} SECURED PAYMENT GATEWAY
            </div>

            <div className="p-6 rounded-sm border border-stone-200 bg-stone-50 space-y-4 text-left text-stone-850">
              <div className="flex justify-between text-xs text-stone-500 mb-2">
                <span>Paying to:</span>
                <span className="font-bold text-stone-900">Mifta Attar House</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500 pb-3 border-b border-stone-200">
                <span>Amount:</span>
                <span className="font-extrabold text-gold-600 font-mono text-lg">৳{total}</span>
              </div>

              {/* Sub-step A: Enter Number */}
              {paymentSubstep === 'number' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-stone-700">
                    Enter your 11-digit mobile account number:
                  </label>
                  <input
                    type="text"
                    value={mfsNumber}
                    onChange={(e) => setMfsNumber(e.target.value)}
                    maxLength={11}
                    className="w-full h-12 px-4 rounded-sm bg-white border border-stone-200 text-center font-bold tracking-widest text-lg focus:outline-none focus:border-gold-500 text-stone-900"
                  />
                  <div className="text-[10px] text-stone-500 flex items-start gap-1.5 leading-relaxed font-sans mt-2">
                    <Info className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <span>This is a secure sandbox gateway simulator. Simply click submit to process. No real money is charged.</span>
                  </div>
                </div>
              )}

              {/* Sub-step B: Enter OTP */}
              {paymentSubstep === 'otp' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'en' ? 'Enter the 6-digit OTP verification code:' : '৬-ডিজিটের ওটিপি ভেরিফিকেশন কোড লিখুন:'}
                  </label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={mfsOtp}
                    onChange={(e) => setMfsOtp(e.target.value)}
                    maxLength={6}
                    className="w-full h-12 px-4 rounded-sm bg-white border border-stone-200 text-center font-mono font-bold tracking-widest text-lg focus:outline-none focus:border-gold-500 text-stone-900 placeholder-stone-300"
                  />
                </div>
              )}

              {/* Sub-step C: Enter PIN */}
              {paymentSubstep === 'pin' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'en' ? 'Enter your account PIN:' : 'আপনার অ্যাকাউন্টের পিন লিখুন:'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••"
                    value={mfsPin}
                    onChange={(e) => setMfsPin(e.target.value)}
                    maxLength={4}
                    className="w-full h-12 px-4 rounded-sm bg-white border border-stone-200 text-center font-mono font-bold tracking-widest text-lg focus:outline-none text-stone-900 placeholder-stone-300"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="flex-1 py-3 border border-stone-200 bg-white rounded-sm hover:bg-stone-100 text-stone-500 font-bold text-xs cursor-pointer"
                >
                  {language === 'en' ? 'CANCEL' : 'বাতিল করুন'}
                </button>
                <button
                  type="button"
                  onClick={handleSimulateMfsSubmit}
                  className="flex-1 py-3 bg-gold-500 hover:brightness-110 text-black rounded-sm font-bold text-xs tracking-wider cursor-pointer"
                >
                  {paymentSubstep === 'pin' 
                    ? (language === 'en' ? 'CONFIRM & AUTHORIZE' : 'পেমেন্ট নিশ্চিত করুন') 
                    : (language === 'en' ? 'SUBMIT' : 'জমা দিন')}
                </button>
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
                {language === 'en' ? 'ALHAMDULILLAH! ORDER COMPLETED' : 'আলহামদুলিল্লাহ! অর্ডার সফল হয়েছে'}
              </h2>
              <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                {language === 'en'
                  ? 'Your transaction has been authorized securely. A packaging advisor is preparing your premium attar box.'
                  : 'আমরা আপনার পেমেন্ট বা অর্ডার তথ্য পেয়েছি। চমৎকার প্যাকেজিংয়ের মাধ্যমে পণ্যটি আপনার ঠিকানায় পাঠাতে কাজ শুরু হয়েছে।'}
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
                  <span className="font-bold text-stone-900 text-right">{completedOrder.address}, {completedOrder.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'en' ? 'Payment Status' : 'পেমেন্ট স্ট্যাটাস'}:</span>
                  <span className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold uppercase text-[9px] tracking-wider">
                    {completedOrder.paymentStatus === 'Pending (COD)' ? (language === 'en' ? 'Pending (COD)' : 'বাকি (ক্যাশ অন ডেলিভারি)') : (language === 'en' ? completedOrder.paymentStatus : 'পরিশোধিত')}
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
              onClick={onClose}
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
