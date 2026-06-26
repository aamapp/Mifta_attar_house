/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Coupon, Order, Review } from '../types';
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  Users,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Briefcase,
  Plus,
  Trash2,
  Check,
  Percent,
  RefreshCw,
  Bell,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const {
    products,
    setProducts,
    orders,
    updateOrderStatus,
    deleteOrder,
    coupons,
    setCoupons,
    reviews,
    deleteReview,
    language,
    addToast,
    websiteSettings,
    updateWebsiteSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'coupons' | 'reviews' | 'settings'>('dashboard');

  // Secure Lock System PIN code states
  const [pin, setPin] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('mifta_admin_logged_in') === 'true';
  });

  // Product Editor state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Dynamic Website Custom Contents state
  const [editedSettings, setEditedSettings] = useState(() => websiteSettings);

  React.useEffect(() => {
    if (websiteSettings) {
      setEditedSettings(websiteSettings);
    }
  }, [websiteSettings]);

  // Form states for adding items
  const [newCoupon, setNewCoupon] = useState<Omit<Coupon, 'isActive'>>({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 800,
    description: { en: 'Special discount!', bn: 'বিশেষ মুল্যছাড় কুপন!' }
  });

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'rating' | 'reviewsCount'>>({
    name: { en: '', bn: '' },
    category: 'oud',
    price: 350,
    originalPrice: 450,
    images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600'],
    description: { en: '', bn: '' },
    specifications: {
      en: [{ label: 'Alcohol Content', value: '100% Alcohol Free' }],
      bn: [{ label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' }]
    },
    benefits: {
      en: ['Pure fragrance blend'],
      bn: ['বিশুদ্ধ সুঘ্রাণ মিশ্রণ']
    },
    usage: { en: 'Apply on clothes.', bn: 'পোশাকে ব্যবহার করুন।' },
    stock: 25
  });

  if (!isOpen) return null;

  // Render Secure PIN Locker if not logged in
  if (!isAdminLoggedIn) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (pin.trim() === 'mifta786') {
        localStorage.setItem('mifta_admin_logged_in', 'true');
        setIsAdminLoggedIn(true);
        addToast(
          { en: 'Successfully logged in to Mifta Control Panel.', bn: 'মিফতা কন্ট্রোল প্যানেলে সফলভাবে প্রবেশ করেছেন।' },
          'success'
        );
        // Force Header component to update
        window.dispatchEvent(new Event('storage'));
      } else {
        addToast(
          { en: 'Incorrect security key! Access Denied.', bn: 'ভুল নিরাপত্তা কোড! প্রবেশাধিকার অস্বীকৃত।' },
          'error'
        );
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-905/75 backdrop-blur-md">
        <div className="relative max-w-md w-full rounded-sm border border-gold-500/30 bg-white p-6 sm:p-8 shadow-2xl text-stone-900 text-center space-y-6">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-sm border border-stone-200 text-stone-400 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center space-y-3">
            <div className="h-14 w-14 rounded-full border border-gold-500 bg-gold-500/10 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-7 h-7 text-gold-600" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gold-600 tracking-wider uppercase">
              {language === 'en' ? 'MIFTA SECURITY LOCK' : 'মিফতা নিরাপত্তা লক'}
            </h3>
            <p className="text-xs text-stone-500 font-sans leading-relaxed">
              {language === 'en'
                ? 'This control center is strictly protected. Please enter your secret admin security code to manage inventory, products, orders and website content.'
                : 'এই কন্ট্রোল সেন্টারটি অত্যন্ত সংবেদনশীল ও সুরক্ষিত। ইনভেন্টরি, কুপন, অর্ডার ও ওয়েবসাইটের কন্টেন্ট পরিচালনা করতে আপনার নিরাপত্তা কোডটি প্রদান করুন।'}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                {language === 'en' ? 'ENTER ADMIN KEY / PIN' : 'অ্যাডমিন সিকিউরিটি কোড দিন'}
              </label>
              <input
                type="password"
                required
                placeholder={language === 'en' ? 'e.g. mifta786' : 'যেমন: mifta786'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full h-11 px-4 rounded-sm border border-stone-300 bg-stone-50 text-stone-900 focus:bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 font-mono text-center tracking-widest placeholder:tracking-normal"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-gold-500 hover:brightness-110 text-black font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-md shadow-gold-500/10 cursor-pointer"
            >
              {language === 'en' ? 'UNLOCK SYSTEM' : 'সিস্টেম আনলক করুন'}
            </button>
          </form>

          <div className="pt-2 border-t border-stone-150 text-[11px] text-gold-600/80 font-semibold bg-gold-500/5 py-1.5 rounded-sm">
            {language === 'en' ? '🔑 Admin Security Code: mifta786' : '🔑 অ্যাডমিন সিকিউরিটি কোড: mifta786'}
          </div>
        </div>
      </div>
    );
  }

  // METRICS CALCULATIONS
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending').length;
  const outOfStockProductsCount = products.filter((p) => p.stock <= 0).length;

  // Add Coupon Handler
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCoupon.code.trim() === '') return;
    const added: Coupon = {
      ...newCoupon,
      code: newCoupon.code.toUpperCase().trim(),
      isActive: true
    };
    setCoupons((prev) => [...prev, added]);
    addToast(
      { en: `Coupon "${added.code}" added!`, bn: `কুপন "${added.code}" তৈরি করা হয়েছে!` },
      'success'
    );
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 800,
      description: { en: '', bn: '' }
    });
  };

  // Delete Coupon
  const handleDeleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    addToast(
      { en: 'Coupon deleted successfully.', bn: 'কুপনটি মুছে ফেলা হয়েছে।' },
      'info'
    );
  };

  // Add Product Handler
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name.en.trim() === '' || newProduct.name.bn.trim() === '') {
      addToast({ en: 'Product titles are required.', bn: 'পণ্যের নাম দেওয়া আবশ্যক।' }, 'error');
      return;
    }
    const added: Product = {
      ...newProduct,
      id: 'prod-' + Math.random().toString(36).substring(2, 9),
      rating: 4.8,
      reviewsCount: 1
    };
    setProducts((prev) => [added, ...prev]);
    addToast(
      { en: `Added product ${added.name.en}!`, bn: `নতুন পণ্য ${added.name.bn} যোগ করা হয়েছে!` },
      'success'
    );
    setNewProduct({
      name: { en: '', bn: '' },
      category: 'oud',
      price: 300,
      originalPrice: 400,
      images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600'],
      description: { en: '', bn: '' },
      specifications: {
        en: [{ label: 'Alcohol Content', value: '100% Alcohol Free' }],
        bn: [{ label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' }]
      },
      benefits: { en: ['Pure essential fragrance oil.'], bn: ['বিশুদ্ধ প্রাকৃতিক এসেনশিয়াল অয়েল।'] },
      usage: { en: 'Apply on pulse points.', bn: 'পালস পয়েন্টে ব্যবহার করুন।' },
      stock: 30
    });
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast(
      { en: 'Product removed from store catalog.', bn: 'পণ্যটি স্টোর ক্যাটালগ থেকে মুছে ফেলা হয়েছে।' },
      'info'
    );
  };

  // Stock editor
  const handleUpdateStock = (id: string, qty: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, qty) } : p))
    );
    addToast({ en: 'Stock adjusted.', bn: 'স্টক সংখ্যা আপডেট করা হয়েছে।' }, 'success');
  };

  // Save Edited Product details handler
  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (editingProduct.name.en.trim() === '' || editingProduct.name.bn.trim() === '') {
      addToast({ en: 'Product name cannot be empty!', bn: 'পণ্যের নাম খালি রাখা যাবে না!' }, 'error');
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    addToast(
      { en: `Updated details for ${editingProduct.name.en}!`, bn: `${editingProduct.name.bn}-এর তথ্য সফলভাবে এডিট করা হয়েছে!` },
      'success'
    );
    setEditingProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative max-w-6xl w-full rounded-sm border border-stone-200 bg-white text-stone-900 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-5 mb-5 shrink-0 text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm border border-gold-500 bg-gold-500/5 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-gold-600 tracking-widest uppercase">
                MIFTA SYSTEM CONTROL CENTER
              </h2>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-sans font-bold">
                Storefront & Inventory Management System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-sm border border-stone-200 bg-stone-50 text-stone-500 hover:text-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 overflow-y-auto min-h-[400px]">
          
          {/* Left Panel Sidebar Tabs (3 Columns) */}
          <div className="lg:col-span-3 flex lg:flex-col justify-between gap-4 border-b lg:border-b-0 lg:border-r border-stone-200 pr-0 lg:pr-4">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 w-full">
              {[
                { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
                { id: 'orders', label: `Orders Log (${orders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
                { id: 'products', label: `Store Catalog (${products.length})`, icon: <Package className="w-4 h-4" /> },
                { id: 'coupons', label: `Coupons System (${coupons.length})`, icon: <Tags className="w-4 h-4" /> },
                { id: 'reviews', label: `Moderation (${reviews.length})`, icon: <MessageSquare className="w-4 h-4" /> },
                { id: 'settings', label: `Website Contents`, icon: <RefreshCw className="w-4 h-4 animate-spin-slow" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-sm text-xs font-bold uppercase transition-all tracking-wider text-left shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gold-500 text-black shadow-md shadow-gold-500/10'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Logout/Lock Button */}
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('mifta_admin_logged_in');
                setIsAdminLoggedIn(false);
                addToast({ en: 'Logged out of admin panel.', bn: 'অ্যাডমিন প্যানেল থেকে সফলভাবে লগআউট করা হয়েছে।' }, 'info');
                // Notify Header to hide the Settings gear button
                window.dispatchEvent(new Event('storage'));
              }}
              className="hidden lg:flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase text-red-600 hover:bg-red-50 hover:text-red-750 rounded-sm cursor-pointer transition-colors mt-auto border border-red-200"
            >
              <X className="w-4 h-4" />
              <span>{language === 'en' ? 'Lock System' : 'সিস্টেম লক করুন'}</span>
            </button>
          </div>

          {/* Right Panel Main Area (9 Columns) */}
          <div className="lg:col-span-9 text-left">
            
            {/* Tab 1: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-sm border border-stone-200 bg-stone-50">
                    <div className="flex justify-between items-center text-stone-500 mb-2">
                      <span className="text-[10px] uppercase font-bold">TOTAL NET REVENUE</span>
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-xl font-extrabold font-mono text-stone-900">৳{totalRevenue}</span>
                  </div>

                  <div className="p-4 rounded-sm border border-stone-200 bg-stone-50">
                    <div className="flex justify-between items-center text-stone-500 mb-2">
                      <span className="text-[10px] uppercase font-bold">ORDERS LOGGED</span>
                      <ShoppingBag className="w-4 h-4 text-gold-600" />
                    </div>
                    <span className="text-xl font-extrabold font-mono text-stone-900">{orders.length}</span>
                  </div>

                  <div className="p-4 rounded-sm border border-stone-200 bg-stone-50">
                    <div className="flex justify-between items-center text-stone-500 mb-2">
                      <span className="text-[10px] uppercase font-bold">PENDING ACTIONS</span>
                      <Bell className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-xl font-extrabold font-mono text-yellow-600">{pendingOrdersCount}</span>
                  </div>

                  <div className="p-4 rounded-sm border border-stone-200 bg-stone-50">
                    <div className="flex justify-between items-center text-stone-500 mb-2">
                      <span className="text-[10px] uppercase font-bold">STOCKOUT THREATS</span>
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-xl font-extrabold font-mono text-red-600">{outOfStockProductsCount}</span>
                  </div>
                </div>

                {/* Sales Analytics Simulated Chart (CSS representation) */}
                <div className="p-5 rounded-sm border border-stone-200 bg-stone-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-gold-600">Sales Analytics Trend</h3>
                      <p className="text-[10px] text-stone-500 font-sans">Simulated daily order counts over current week</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-gold-600" />
                  </div>

                  {/* Gorgeous visual progress trend bar representational chart */}
                  <div className="grid grid-cols-7 items-end h-32 gap-3 pt-4 border-b border-stone-200">
                    {[
                      { day: 'Mon', value: 35 },
                      { day: 'Tue', value: 55 },
                      { day: 'Wed', value: 45 },
                      { day: 'Thu', value: 75 },
                      { day: 'Fri', value: 95 },
                      { day: 'Sat', value: 80 },
                      { day: 'Sun', value: 110 }
                    ].map((d) => (
                      <div key={d.day} className="flex flex-col items-center gap-2">
                        <div className="w-full bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-sm hover:brightness-110 transition-all cursor-pointer relative group" style={{ height: `${(d.value / 120) * 100}px` }}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-900 border border-stone-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity font-mono text-white">৳{d.value * 250}</span>
                        </div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Orders Management */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-stone-800">Pending & Shipped Orders Logs</h3>
                  <span className="text-xs text-stone-500 font-mono">Total {orders.length}</span>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-sm border border-stone-200 bg-stone-50 space-y-3 text-xs">
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-stone-200 pb-2">
                        <div>
                          <span className="font-bold text-gold-600 font-mono text-sm">{ord.id}</span>
                          <span className="text-stone-500 ml-2 font-mono">{new Date(ord.date).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Order status dispatchers */}
                        <div className="flex items-center gap-1.5">
                          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(ord.id, st as any)}
                              className={`px-2 py-1 rounded-sm text-[9px] font-bold uppercase transition-all cursor-pointer ${
                                ord.orderStatus === st
                                  ? 'bg-gold-500 text-black font-extrabold'
                                  : 'border border-stone-200 hover:bg-stone-100 text-stone-500'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-600">
                        <div className="space-y-1">
                          <span className="block text-[10px] text-stone-500 font-bold uppercase">Customer details</span>
                          <p className="font-sans font-semibold text-stone-900">
                            {ord.customerName} ({ord.phone})
                          </p>
                          <p className="font-sans text-stone-600">{ord.address}, {ord.district}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[10px] text-stone-500 font-bold uppercase">Payment details</span>
                          <p className="font-sans font-semibold text-stone-900">
                            Method: {ord.paymentMethod.toUpperCase()} | Status: {ord.paymentStatus}
                          </p>
                          <p className="font-sans">Subtotal: ৳{ord.subtotal} | Discount: ৳{ord.discount}</p>
                        </div>
                      </div>

                      {/* Purchased Items List */}
                      <div className="bg-stone-100 p-2.5 rounded-sm border border-stone-200 text-[11px] space-y-1 text-stone-800">
                        {ord.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-stone-700">
                            <span>• {item.name} {item.size ? `(${item.size})` : ''} x {item.quantity}</span>
                            <span className="font-mono text-stone-500">৳{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <button
                          onClick={() => deleteOrder(ord.id)}
                          className="text-red-600 hover:text-red-500 font-bold uppercase text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Order Logs</span>
                        </button>
                        <span className="text-gold-600 font-bold font-mono text-sm">
                          ৳{ord.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Store Catalog Products */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                
                {/* Product Form: conditional between Edit and Add */}
                {editingProduct ? (
                  <form onSubmit={handleSaveEditProduct} className="p-4 rounded-sm border-2 border-gold-500 bg-stone-50 space-y-4 shadow-lg text-stone-900">
                    <div className="text-xs font-bold text-gold-600 uppercase tracking-widest flex items-center justify-between border-b border-stone-200 pb-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <RefreshCw className="w-4 h-4 animate-spin-slow" />
                        <span>EDITING PRODUCT: {editingProduct.name.en} / {editingProduct.name.bn}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-[10px] text-stone-500 hover:text-stone-900 font-bold uppercase tracking-wider px-2.5 py-1 border border-stone-200 bg-white rounded-sm cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Product Name (EN) *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name.en}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, en: e.target.value } })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Product Name (BN) *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name.bn}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, bn: e.target.value } })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Category</label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full h-10 px-2 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        >
                          <option value="oud">Oud Collection</option>
                          <option value="arabic">Arabic Attar</option>
                          <option value="floral">Floral Collection</option>
                          <option value="fresh">Sporty & Fresh</option>
                          <option value="natural">Natural & Health</option>
                          <option value="gifts">Gift Boxes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Catalog Price (৳) *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Stock *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-mono font-bold"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Image URL *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.images[0] || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-sans"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Product Description (EN) *</label>
                        <textarea
                          required
                          value={editingProduct.description.en}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, en: e.target.value } })}
                          className="w-full h-20 p-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Product Description (BN) *</label>
                        <textarea
                          required
                          value={editingProduct.description.bn}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, bn: e.target.value } })}
                          className="w-full h-20 p-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-gold-500 hover:brightness-110 text-black font-bold rounded-sm text-xs tracking-widest uppercase cursor-pointer"
                      >
                        SAVE PRODUCT CHANGES
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-6 py-3 border border-stone-200 bg-white text-stone-700 font-bold rounded-sm text-xs tracking-widest uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Form to add a new Product */
                  <form onSubmit={handleAddProduct} className="p-4 rounded-sm border border-stone-200 bg-stone-50 space-y-4">
                    <div className="text-xs font-bold text-gold-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-stone-200 pb-2 mb-2">
                      <Plus className="w-4 h-4" />
                      <span>LAUNCH NEW PRODUCT IN CATALOG</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Product Name (EN) *</label>
                        <input
                          type="text"
                          required
                          value={newProduct.name.en}
                          onChange={(e) => setNewProduct({ ...newProduct, name: { ...newProduct.name, en: e.target.value } })}
                          placeholder="e.g. Royal Oud Luxury Attar"
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Product Name (BN) *</label>
                        <input
                          type="text"
                          required
                          value={newProduct.name.bn}
                          onChange={(e) => setNewProduct({ ...newProduct, name: { ...newProduct.name, bn: e.target.value } })}
                          placeholder="উদা: রয়্যাল উদ লাক্সারি আতর"
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Category</label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="w-full h-10 px-2 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        >
                          <option value="oud">Oud Collection</option>
                          <option value="arabic">Arabic Attar</option>
                          <option value="floral">Floral Collection</option>
                          <option value="fresh">Sporty & Fresh</option>
                          <option value="natural">Natural & Health</option>
                          <option value="gifts">Gift Boxes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Catalog Price (৳) *</label>
                        <input
                          type="number"
                          required
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Initial Stock *</label>
                        <input
                          type="number"
                          required
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Product Description (EN)</label>
                        <input
                          type="text"
                          value={newProduct.description.en}
                          onChange={(e) => setNewProduct({ ...newProduct, description: { ...newProduct.description, en: e.target.value } })}
                          placeholder="Brief notes about ingredients and sillage..."
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gold-500 hover:brightness-110 text-black font-bold rounded-sm text-xs tracking-widest uppercase cursor-pointer"
                    >
                      DEPLOY LAUNCHED PRODUCT
                    </button>
                  </form>
                )}

                {/* Products List & Stock editor */}
                <div className="space-y-3.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">Store Catalog Inventory ({products.length})</h4>
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center gap-4 p-3 rounded-sm border border-stone-200 bg-stone-50 text-xs text-left">
                        <img src={p.images[0]} className="w-10 h-10 object-cover rounded-sm border border-stone-200" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-stone-950 truncate">{language === 'en' ? p.name.en : p.name.bn}</h5>
                          <span className="text-[10px] text-gold-600 font-mono font-bold">৳{p.price} | Category: {p.category}</span>
                        </div>
                        
                        {/* Stock Adjustment Input */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-500 font-bold uppercase">Stock:</span>
                          <input
                            type="number"
                            value={p.stock}
                            onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                            className="w-16 h-8 rounded-sm bg-white border border-stone-200 text-center font-bold font-mono text-stone-900 focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          className="text-stone-400 hover:text-gold-600 p-2 cursor-pointer transition-colors"
                          title="Edit Details"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-stone-400 hover:text-red-600 p-2 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 4: Coupons system */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                
                {/* Form to generate new Coupon */}
                <form onSubmit={handleAddCoupon} className="p-4 rounded-sm border border-stone-200 bg-stone-50 space-y-4">
                  <div className="text-xs font-bold text-gold-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-stone-200 pb-2 mb-2">
                    <Percent className="w-4 h-4" />
                    <span>CREATE NEW ACTIVE COUPON CODE</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. MIFTA50"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                        className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Discount Type</label>
                      <select
                        value={newCoupon.discountType}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                        className="w-full h-10 px-2 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Flat Taka (৳)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Value *</label>
                      <input
                        type="number"
                        required
                        value={newCoupon.discountValue}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                        className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Min Order Requirement</label>
                      <input
                        type="number"
                        value={newCoupon.minOrderValue || ''}
                        onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) || undefined })}
                        placeholder="৳800"
                        className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gold-500 hover:brightness-110 text-black font-bold rounded-sm text-xs tracking-widest uppercase cursor-pointer"
                  >
                    REGISTER COUPON IN STORE
                  </button>
                </form>

                {/* Active Coupons list */}
                <div className="space-y-3.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">Current Registered Coupons ({coupons.length})</h4>
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {coupons.map((c) => (
                      <div key={c.code} className="flex items-center justify-between p-3.5 rounded-sm border border-stone-200 bg-stone-50 text-xs text-left">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-gold-600 border border-gold-200 px-2 py-0.5 rounded-sm bg-gold-500/5 text-xs mr-2">{c.code}</span>
                          <span className="text-stone-600 font-sans text-xs">
                            {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `৳${c.discountValue} Flat Off`}
                            {c.minOrderValue ? ` on orders above ৳${c.minOrderValue}` : ''}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteCoupon(c.code)}
                          className="text-stone-400 hover:text-red-600 p-2 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 5: Reviews Moderation */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-stone-900">Customer Testimonials Moderation</h3>
                  <span className="text-xs text-stone-500 font-mono">Total {reviews.length} reviews</span>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-sm border border-stone-200 bg-stone-50 space-y-2 text-xs text-left">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-stone-900">{rev.userName}</span>
                          <span className="text-[10px] text-stone-500 ml-2 font-mono">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 font-bold uppercase text-[9px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                          <Check className="w-3 h-3" />
                          <span>Approved & Verified</span>
                        </div>
                      </div>

                      <p className="font-sans italic text-stone-700 text-xs">"{rev.comment}"</p>

                      <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                        <span className="text-[10px] text-gold-600 font-mono">Product ID: {rev.productId}</span>
                        <button
                          onClick={() => deleteReview(rev.id)}
                          className="text-red-600 hover:text-red-500 font-bold uppercase text-[9px] flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Moderate Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 6: Website custom settings */}
            {activeTab === 'settings' && editedSettings && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateWebsiteSettings(editedSettings);
                  addToast(
                    { en: 'Website text content deployed successfully!', bn: 'ওয়েবসাইটের কন্টেন্ট সফলভাবে আপডেট করা হয়েছে!' },
                    'success'
                  );
                }}
                className="space-y-6 text-stone-900 text-left"
              >
                <div className="p-5 rounded-sm border border-stone-200 bg-stone-50 space-y-5">
                  <div className="text-xs font-bold text-gold-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-stone-200 pb-2 mb-2">
                    <RefreshCw className="w-4 h-4 animate-spin-slow" />
                    <span>MANAGE WEBSITES CORE TEXT CONTENTS</span>
                  </div>

                  <div className="space-y-4">
                    {/* Hero Headline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Hero Title (English) *</label>
                        <input
                          type="text"
                          required
                          value={editedSettings.heroTitleEn}
                          onChange={(e) => setEditedSettings({ ...editedSettings, heroTitleEn: e.target.value })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Hero Title (Bengali) *</label>
                        <input
                          type="text"
                          required
                          value={editedSettings.heroTitleBn}
                          onChange={(e) => setEditedSettings({ ...editedSettings, heroTitleBn: e.target.value })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-medium"
                        />
                      </div>
                    </div>

                    {/* Hero Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Hero Subtitle / Desc (English) *</label>
                        <textarea
                          required
                          rows={3}
                          value={editedSettings.heroDescEn}
                          onChange={(e) => setEditedSettings({ ...editedSettings, heroDescEn: e.target.value })}
                          className="w-full p-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Hero Subtitle / Desc (Bengali) *</label>
                        <textarea
                          required
                          rows={3}
                          value={editedSettings.heroDescBn}
                          onChange={(e) => setEditedSettings({ ...editedSettings, heroDescBn: e.target.value })}
                          className="w-full p-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Promo Texts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Promo Coupon Text (English)</label>
                        <input
                          type="text"
                          value={editedSettings.promoTextEn}
                          onChange={(e) => setEditedSettings({ ...editedSettings, promoTextEn: e.target.value })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Promo Coupon Text (Bengali)</label>
                        <input
                          type="text"
                          value={editedSettings.promoTextBn}
                          onChange={(e) => setEditedSettings({ ...editedSettings, promoTextBn: e.target.value })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gold-500 hover:brightness-110 text-black font-bold rounded-sm text-xs tracking-widest uppercase cursor-pointer shadow-md transition-all"
                  >
                    DEPLOY LIVE TEXT UPDATES
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
