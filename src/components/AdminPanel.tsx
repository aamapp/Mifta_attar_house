/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Coupon, Order, Review, IslamicQuote } from '../types';
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
  ShieldAlert,
  Database,
  Server,
  CheckCircle,
  AlertTriangle,
  Copy,
  Settings,
  HeartHandshake,
  Truck,
  Image
} from 'lucide-react';
import { motion } from 'motion/react';
import { SUPABASE_SQL_CREATION_QUERY, uploadProductImage } from '../lib/supabase';

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
    setOrders,
    coupons,
    setCoupons,
    reviews,
    deleteReview,
    language,
    addToast,
    websiteSettings,
    updateWebsiteSettings,
    supabaseStatus,
    syncingWithSupabase,
    syncAllToSupabase,
    refetchFromSupabase,
    islamicQuotes,
    setIslamicQuotes
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'coupons' | 'reviews' | 'quotes' | 'settings' | 'supabase'>('dashboard');

  // Secure Lock System PIN code states
  const [pin, setPin] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('mifta_admin_logged_in') === 'true';
  });

  // Product Editor state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
    stock: 25,
    isBestSeller: false,
    isNewArrival: true,
    isTrending: false,
    isFlashSale: false,
    flashSaleDiscount: 0
  });

  const [newQuote, setNewQuote] = useState<IslamicQuote>({
    quote: { en: '', bn: '' },
    source: { en: '', bn: '' }
  });

  const handleLocalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      addToast(
        { en: 'Please select an image file.', bn: 'দয়া করে একটি ছবি ফাইল নির্বাচন করুন।' },
        'error'
      );
      return;
    }

    // Check size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast(
        { en: 'File size too large! Max 5MB.', bn: 'ফাইলের আকার অনেক বড়! সর্বোচ্চ ৫ মেগাবাইট।' },
        'error'
      );
      return;
    }

    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadProductImage(file);
      if (publicUrl) {
        if (isEditing && editingProduct) {
          setEditingProduct({ ...editingProduct, images: [publicUrl] });
        } else {
          setNewProduct({ ...newProduct, images: [publicUrl] });
        }
        addToast(
          { en: 'Image uploaded successfully!', bn: 'ছবি সফলভাবে আপলোড হয়েছে!' },
          'success'
        );
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      addToast(
        { en: 'Failed to upload image. Make sure "product-images" bucket exists in Supabase Storage.', bn: 'ছবি আপলোড করতে ব্যর্থ হয়েছে। নিশ্চিত করুন সুপাবেসে "product-images" বাকেট তৈরি করা আছে।' },
        'error'
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

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
      stock: 30,
      isBestSeller: false,
      isNewArrival: true,
      isTrending: false,
      isFlashSale: false,
      flashSaleDiscount: 0
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

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.quote.en || !newQuote.quote.bn) {
      addToast({ en: 'Quote text is required in both languages.', bn: 'উভয় ভাষায় বাণী দেওয়া আবশ্যক।' }, 'error');
      return;
    }
    setIslamicQuotes(prev => [...prev, newQuote]);
    setNewQuote({ quote: { en: '', bn: '' }, source: { en: '', bn: '' } });
    addToast({ en: 'Alhamdulillah! New Islamic quote added to catalog.', bn: 'আলহামদুলিল্লাহ! নতুন ইসলামিক বাণী সফলভাবে যুক্ত হয়েছে।' }, 'success');
  };

  const handleDeleteQuote = (index: number) => {
    setIslamicQuotes(prev => prev.filter((_, i) => i !== index));
    addToast({ en: 'Islamic quote removed.', bn: 'বাণীটি মুছে ফেলা হয়েছে।' }, 'info');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-md overflow-hidden">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-6xl rounded-none sm:rounded-sm border-none sm:border border-stone-200 bg-white text-stone-900 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 p-4 sm:p-6 shrink-0 text-left bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm border border-gold-500 bg-gold-500/5 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <h2 className="font-serif text-sm sm:text-lg font-bold text-gold-600 tracking-widest uppercase leading-tight">
                মিফতা সিস্টেম কন্ট্রোল সেন্টার
              </h2>
              <p className="text-[9px] sm:text-[10px] text-stone-500 uppercase tracking-widest font-sans font-bold">
                স্টোরফ্রন্ট ও ইনভেন্টরি ম্যানেজমেন্ট সিস্টেম
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-sm border border-stone-200 bg-white text-stone-500 hover:text-black cursor-pointer shadow-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-72 flex lg:flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200 bg-stone-50/30 overflow-hidden">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-y-auto lg:overflow-x-visible p-2 sm:p-4 w-full no-scrollbar">
              {[
                { id: 'dashboard', label: 'ড্যাশবোর্ড ওভারভিউ', icon: <LayoutDashboard className="w-4 h-4" /> },
                { id: 'orders', label: `অর্ডারসমূহ (${orders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
                { id: 'products', label: `পণ্যসমূহ (${products.length})`, icon: <Package className="w-4 h-4" /> },
                { id: 'coupons', label: `কুপনসমূহ (${coupons.length})`, icon: <Tags className="w-4 h-4" /> },
                { id: 'reviews', label: `রিভিউসমূহ (${reviews.length})`, icon: <MessageSquare className="w-4 h-4" /> },
                { id: 'quotes', label: `ইসলামিক বাণী (${islamicQuotes.length})`, icon: <HeartHandshake className="w-4 h-4" /> },
                { id: 'settings', label: `ওয়েবসাইটের লেখা`, icon: <RefreshCw className="w-4 h-4" /> },
                { id: 'supabase', label: `সুপাবেস ডাটাবেস`, icon: <Database className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-sm text-[11px] font-bold uppercase transition-all tracking-wider text-left shrink-0 cursor-pointer whitespace-nowrap lg:whitespace-normal ${
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
                window.dispatchEvent(new Event('storage'));
              }}
              className="hidden lg:flex items-center gap-2 px-4 py-3 text-[11px] font-bold uppercase text-red-600 hover:bg-red-50 rounded-sm cursor-pointer transition-colors mt-auto m-4 border border-red-200"
            >
              <X className="w-4 h-4" />
              <span>{language === 'en' ? 'Lock System' : 'সিস্টেম লক করুন'}</span>
            </button>
          </div>

          {/* Right Panel Main Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white min-h-0">
            
            {/* Tab 1: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-sm border border-stone-200 bg-stone-50">
                    <div className="flex justify-between items-center text-stone-500 mb-2">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-stone-400">মোট নীট রাজস্ব</span>
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm sm:text-xl font-extrabold font-mono text-stone-900 block truncate">৳{totalRevenue}</span>
                  </div>

                  <div className="p-4 rounded-sm border border-stone-200 bg-stone-50">
                    <div className="flex justify-between items-center text-stone-500 mb-2">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-stone-400">অর্ডার লগ</span>
                      <ShoppingBag className="w-4 h-4 text-gold-600" />
                    </div>
                    <span className="text-sm sm:text-xl font-extrabold font-mono text-stone-900 block">{orders.length}</span>
                  </div>

                  <div className="p-4 rounded-sm border border-stone-200 bg-stone-50">
                    <div className="flex justify-between items-center text-stone-500 mb-2">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-stone-400">অপেক্ষারত</span>
                      <Bell className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-sm sm:text-xl font-extrabold font-mono text-stone-900 block">{pendingOrdersCount}</span>
                  </div>

                  <div className="p-4 rounded-sm border border-stone-200 bg-stone-50">
                    <div className="flex justify-between items-center text-stone-500 mb-2">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-stone-400">স্টক এলার্ট</span>
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-sm sm:text-xl font-extrabold font-mono text-stone-900 block">{outOfStockProductsCount}</span>
                  </div>
                </div>

                {/* Sales Analytics Simulated Chart */}
                <div className="p-5 rounded-sm border border-stone-200 bg-stone-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[11px] uppercase tracking-wider text-stone-500">বিক্রয় বিশ্লেষণ ট্রেন্ড</h3>
                      <p className="text-[10px] text-stone-400 font-sans">সাপ্তাহিক অর্ডার ভলিউম পারফরম্যান্স</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-gold-600" />
                  </div>
                  <div className="grid grid-cols-7 items-end h-28 gap-2 sm:gap-4 pt-4 border-b border-stone-200">
                    {[
                      { day: 'Mon', value: 35 }, { day: 'Tue', value: 55 }, { day: 'Wed', value: 45 },
                      { day: 'Thu', value: 75 }, { day: 'Fri', value: 95 }, { day: 'Sat', value: 80 },
                      { day: 'Sun', value: 110 }
                    ].map((d) => (
                      <div key={d.day} className="flex flex-col items-center gap-2">
                        <div className="w-full bg-gold-500 rounded-t-sm hover:brightness-110 transition-all cursor-pointer relative group" style={{ height: `${(d.value / 120) * 100}%` }}></div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">{d.day}</span>
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
                  <h3 className="font-bold text-sm text-stone-800">অপেক্ষারত ও শিপড অর্ডার লগ</h3>
                  <span className="text-xs text-stone-500 font-mono">মোট {orders.length}</span>
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
                          <span className="block text-[10px] text-stone-500 font-bold uppercase">কাস্টমারের বিবরণ</span>
                          <p className="font-sans font-semibold text-stone-900">
                            {ord.customerName} ({ord.phone})
                          </p>
                          <p className="font-sans text-stone-600">{ord.address}, {ord.district}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[10px] text-stone-500 font-bold uppercase">পেমেন্টের বিবরণ</span>
                          <p className="font-sans font-semibold text-stone-900">
                            পদ্ধতি: {ord.paymentMethod.toUpperCase()} | স্ট্যাটাস: {ord.paymentStatus === 'paid' ? 'পরিশোধিত' : 'বাকি'}
                          </p>
                          <p className="font-sans">সাবটোটাল: ৳{ord.subtotal} | ডিসকাউন্ট: ৳{ord.discount}</p>
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

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 gap-4 border-t border-stone-200">
                        <div className="flex flex-wrap gap-2 flex-1">
                          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(ord.id, st as any)}
                              className={`px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase transition-all cursor-pointer border ${
                                ord.orderStatus === st
                                  ? 'bg-gold-500 border-gold-500 text-black'
                                  : 'border-stone-200 hover:bg-stone-100 text-stone-500 bg-white'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="flex-1 sm:w-40 relative">
                            <input
                              type="text"
                              value={ord.trackingNumber || ''}
                              onChange={(e) => {
                                const newOrders = orders.map(o => o.id === ord.id ? {...o, trackingNumber: e.target.value} : o);
                                setOrders(newOrders);
                              }}
                              placeholder="TRACKING #"
                              className="w-full h-8 px-2 pl-7 rounded-sm border border-stone-200 text-[10px] font-mono font-bold focus:outline-none focus:border-gold-500"
                            />
                            <Truck className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-stone-400" />
                          </div>
                          
                          <button
                            onClick={() => deleteOrder(ord.id)}
                            className="p-2 rounded-sm border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-stone-900 text-gold-500 px-3 py-2 rounded-sm">
                        <span className="text-[10px] font-bold uppercase tracking-widest">মোট পরিশোধযোগ্য</span>
                        <span className="text-sm font-black font-mono tracking-tighter">৳{ord.total}</span>
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
                        <span>পণ্য এডিট করা হচ্ছে: {editingProduct.name.bn}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-[10px] text-stone-500 hover:text-stone-900 font-bold uppercase tracking-wider px-2.5 py-1 border border-stone-200 bg-white rounded-sm cursor-pointer"
                      >
                        বন্ধ করুন
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">পণ্যের নাম (ইংরেজি) *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name.en}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, en: e.target.value } })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">পণ্যের নাম (বাংলা) *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name.bn}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, bn: e.target.value } })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">ক্যাটাগরি</label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full h-10 px-2 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        >
                          <option value="oud">উদ কালেকশন</option>
                          <option value="arabic">অ্যারাবিক আতর</option>
                          <option value="floral">ফ্লোরাল কালেকশন</option>
                          <option value="fresh">স্পোর্টি ও ফ্রেশ</option>
                          <option value="natural">ন্যাচারাল ও হেলথ</option>
                          <option value="gifts">গিফট বক্স</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">ক্যাটালগ মূল্য (৳) *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">স্টক *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-mono font-bold"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">ছবির লিঙ্ক (Image URL) *</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            required
                            value={editingProduct.images[0] || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                            className="flex-1 h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-sans"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              id="edit-product-image-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleLocalFileUpload(e, true)}
                            />
                            <label
                              htmlFor="edit-product-image-upload"
                              className={`h-10 px-4 flex items-center gap-2 rounded-sm bg-stone-900 text-gold-500 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-black transition-all ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                              <Image className="w-3.5 h-3.5" />
                              {isUploadingImage ? 'আপলোড হচ্ছে...' : 'ডিভাইস থেকে'}
                            </label>
                          </div>
                        </div>
                        
                        {/* Image Preview */}
                        {editingProduct.images[0] && (
                          <div className="mt-3 p-2 bg-white border border-stone-100 rounded-sm inline-block">
                            <div className="text-[9px] font-bold text-stone-400 uppercase mb-1">প্রিভিউ:</div>
                            <img 
                              src={editingProduct.images[0]} 
                              alt="Preview" 
                              className="h-32 w-auto object-contain rounded-sm border border-stone-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">পণ্যের বিবরণ (ইংরেজি) *</label>
                        <textarea
                          required
                          value={editingProduct.description.en}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, en: e.target.value } })}
                          className="w-full h-20 p-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">পণ্যের বিবরণ (বাংলা) *</label>
                        <textarea
                          required
                          value={editingProduct.description.bn}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, bn: e.target.value } })}
                          className="w-full h-20 p-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>

                      {/* New Fields for Professional Control */}
                      <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-white border border-stone-100 rounded-sm">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="edit-best" checked={editingProduct.isBestSeller} onChange={(e) => setEditingProduct({...editingProduct, isBestSeller: e.target.checked})} />
                          <label htmlFor="edit-best" className="text-[10px] font-bold text-stone-600 uppercase">বেস্ট সেলার</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="edit-new" checked={editingProduct.isNewArrival} onChange={(e) => setEditingProduct({...editingProduct, isNewArrival: e.target.checked})} />
                          <label htmlFor="edit-new" className="text-[10px] font-bold text-stone-600 uppercase">নতুন কালেকশন</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="edit-trend" checked={editingProduct.isTrending} onChange={(e) => setEditingProduct({...editingProduct, isTrending: e.target.checked})} />
                          <label htmlFor="edit-trend" className="text-[10px] font-bold text-stone-600 uppercase">ট্রেন্ডিং</label>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600">
                          <input type="checkbox" id="edit-flash" checked={editingProduct.isFlashSale} onChange={(e) => setEditingProduct({...editingProduct, isFlashSale: e.target.checked})} />
                          <label htmlFor="edit-flash" className="text-[10px] font-bold uppercase">ফ্ল্যাশ সেল</label>
                        </div>
                      </div>

                      {editingProduct.isFlashSale && (
                        <div className="sm:col-span-3 p-3 bg-orange-50 border border-orange-100 rounded-sm">
                          <label className="block text-[10px] uppercase font-bold text-orange-600 mb-1">ফ্ল্যাশ সেল ডিসকাউন্ট (%)</label>
                          <input
                            type="number"
                            value={editingProduct.flashSaleDiscount || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, flashSaleDiscount: Number(e.target.value) })}
                            className="w-full h-10 px-3 rounded-sm bg-white border border-orange-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-mono font-bold"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-gold-500 hover:brightness-110 text-black font-bold rounded-sm text-xs tracking-widest uppercase cursor-pointer"
                      >
                        পরিবর্তনগুলো সংরক্ষণ করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-6 py-3 border border-stone-200 bg-white text-stone-700 font-bold rounded-sm text-xs tracking-widest uppercase cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Form to add a new Product */
                  <form onSubmit={handleAddProduct} className="p-4 rounded-sm border border-stone-200 bg-stone-50 space-y-4">
                    <div className="text-xs font-bold text-gold-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-stone-200 pb-2 mb-2">
                      <Plus className="w-4 h-4" />
                      <span>ক্যাটালগে নতুন পণ্য যুক্ত করুন</span>
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
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Product Description (BN)</label>
                        <textarea
                          value={newProduct.description.bn}
                          onChange={(e) => setNewProduct({ ...newProduct, description: { ...newProduct.description, bn: e.target.value } })}
                          placeholder="উপাদান এবং সুগন্ধ সম্পর্কে সংক্ষিপ্ত নোট..."
                          className="w-full h-20 p-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">ছবির লিঙ্ক (Image URL) *</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            required
                            value={newProduct.images[0]}
                            onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              id="add-product-image-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleLocalFileUpload(e, false)}
                            />
                            <label
                              htmlFor="add-product-image-upload"
                              className={`h-10 px-4 flex items-center gap-2 rounded-sm bg-stone-900 text-gold-500 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-black transition-all ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                              <Image className="w-3.5 h-3.5" />
                              {isUploadingImage ? 'আপলোড হচ্ছে...' : 'ডিভাইস থেকে'}
                            </label>
                          </div>
                        </div>

                        {/* Image Preview */}
                        {newProduct.images[0] && (
                          <div className="mt-3 p-2 bg-white border border-stone-100 rounded-sm inline-block">
                            <div className="text-[9px] font-bold text-stone-400 uppercase mb-1">প্রিভিউ:</div>
                            <img 
                              src={newProduct.images[0]} 
                              alt="Preview" 
                              className="h-32 w-auto object-contain rounded-sm border border-stone-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-white border border-stone-100 rounded-sm">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="new-best" checked={newProduct.isBestSeller} onChange={(e) => setNewProduct({...newProduct, isBestSeller: e.target.checked})} />
                          <label htmlFor="new-best" className="text-[10px] font-bold text-stone-600 uppercase tracking-tighter">Best Seller</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="new-new" checked={newProduct.isNewArrival} onChange={(e) => setNewProduct({...newProduct, isNewArrival: e.target.checked})} />
                          <label htmlFor="new-new" className="text-[10px] font-bold text-stone-600 uppercase tracking-tighter">New Arrival</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="new-trend" checked={newProduct.isTrending} onChange={(e) => setNewProduct({...newProduct, isTrending: e.target.checked})} />
                          <label htmlFor="new-trend" className="text-[10px] font-bold text-stone-600 uppercase tracking-tighter">Trending</label>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600">
                          <input type="checkbox" id="new-flash" checked={newProduct.isFlashSale} onChange={(e) => setNewProduct({...newProduct, isFlashSale: e.target.checked})} />
                          <label htmlFor="new-flash" className="text-[10px] font-bold uppercase tracking-tighter">Flash Sale</label>
                        </div>
                      </div>

                      {newProduct.isFlashSale && (
                        <div className="sm:col-span-3 p-3 bg-orange-50 border border-orange-100 rounded-sm">
                          <label className="block text-[10px] uppercase font-bold text-orange-600 mb-1">Flash Sale Discount (%)</label>
                          <input
                            type="number"
                            value={newProduct.flashSaleDiscount}
                            onChange={(e) => setNewProduct({ ...newProduct, flashSaleDiscount: Number(e.target.value) })}
                            className="w-full h-10 px-3 rounded-sm bg-white border border-orange-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-mono font-bold"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-stone-900 text-gold-500 font-bold rounded-sm text-xs tracking-widest uppercase hover:bg-black transition-colors cursor-pointer"
                    >
                      পণ্যটি তালিকায় যুক্ত করুন
                    </button>
                  </form>
                )}

                {/* Products List & Stock editor */}
                <div className="space-y-3.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">স্টোর ক্যাটালগ ইনভেন্টরি ({products.length})</h4>
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
                    <span>নতুন কুপন কোড তৈরি করুন</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">কুপন কোড *</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: MIFTA50"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                        className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">ডিসকাউন্ট ধরন</label>
                      <select
                        value={newCoupon.discountType}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                        className="w-full h-10 px-2 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                      >
                        <option value="percentage">শতকরা (%)</option>
                        <option value="fixed">নির্দিষ্ট টাকা (৳)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">পরিমাণ *</label>
                      <input
                        type="number"
                        required
                        value={newCoupon.discountValue}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                        className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">সর্বনিম্ন অর্ডার</label>
                      <input
                        type="number"
                        value={newCoupon.minOrderValue || ''}
                        onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) || undefined })}
                        placeholder="৳৮০০"
                        className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gold-500 hover:brightness-110 text-black font-bold rounded-sm text-xs tracking-widest uppercase cursor-pointer"
                  >
                    কুপনটি রেজিস্টার করুন
                  </button>
                </form>

                {/* Active Coupons list */}
                <div className="space-y-3.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">বর্তমানে রেজিস্টার করা কুপনসমূহ ({coupons.length})</h4>
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
                  <h3 className="font-bold text-sm text-stone-900">কাস্টমার রিভিউ মডারেশন</h3>
                  <span className="text-xs text-stone-500 font-mono">মোট {reviews.length} টি রিভিউ</span>
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
                    <span>ওয়েবসাইটের মূল লেখাগুলো পরিবর্তন করুন</span>
                  </div>

                  <div className="space-y-4">
                    {/* Hero Headline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">হিরো শিরোনাম (ইংরেজি) *</label>
                        <input
                          type="text"
                          required
                          value={editedSettings.heroTitleEn}
                          onChange={(e) => setEditedSettings({ ...editedSettings, heroTitleEn: e.target.value })}
                          className="w-full h-10 px-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">হিরো শিরোনাম (বাংলা) *</label>
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
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">হিরো সাবটাইটেল / বিবরণ (ইংরেজি) *</label>
                        <textarea
                          required
                          rows={3}
                          value={editedSettings.heroDescEn}
                          onChange={(e) => setEditedSettings({ ...editedSettings, heroDescEn: e.target.value })}
                          className="w-full p-3 rounded-sm bg-white border border-stone-200 text-xs focus:outline-none focus:border-gold-500 text-stone-900 leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">হিরো সাবটাইটেল / বিবরণ (বাংলা) *</label>
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

            {/* Tab 7: Supabase Integration Panel */}
            {/* Tab: Islamic Quotes Management */}
            {activeTab === 'quotes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-stone-900 uppercase tracking-widest">ইসলামিক বাণী ক্যাটালগ</h3>
                  <span className="text-[10px] text-stone-500 font-mono bg-stone-100 px-2 py-1 rounded-sm uppercase font-bold">ডাইনামিক কোটস ইঞ্জিন</span>
                </div>

                {/* Add New Quote Form */}
                <form onSubmit={handleAddQuote} className="p-4 sm:p-5 rounded-sm border border-stone-200 bg-stone-50 space-y-4 shadow-sm text-left">
                  <div className="text-[10px] font-bold text-gold-600 uppercase tracking-widest border-b border-stone-200 pb-2 mb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>নতুন বাণী যুক্ত করুন</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase font-bold text-stone-500">বাণী (ইংরেজি) *</label>
                      <textarea
                        required
                        value={newQuote.quote.en}
                        onChange={(e) => setNewQuote({...newQuote, quote: {...newQuote.quote, en: e.target.value}})}
                        className="w-full h-20 p-3 rounded-sm border border-stone-200 bg-white text-xs focus:outline-none focus:border-gold-500"
                        placeholder="In the remembrance of Allah do hearts find rest..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase font-bold text-stone-500">বাণী (বাংলা) *</label>
                      <textarea
                        required
                        value={newQuote.quote.bn}
                        onChange={(e) => setNewQuote({...newQuote, quote: {...newQuote.quote, bn: e.target.value}})}
                        className="w-full h-20 p-3 rounded-sm border border-stone-200 bg-white text-xs focus:outline-none focus:border-gold-500"
                        placeholder="আল্লাহর স্মরণেই অন্তরসমূহ প্রশান্তি পায়..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase font-bold text-stone-500">উৎস (ইংরেজি)</label>
                      <input
                        type="text"
                        value={newQuote.source.en}
                        onChange={(e) => setNewQuote({...newQuote, source: {...newQuote.source, en: e.target.value}})}
                        className="w-full h-10 px-3 rounded-sm border border-stone-200 bg-white text-xs focus:outline-none focus:border-gold-500"
                        placeholder="Al-Qur'an 13:28"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase font-bold text-stone-500">উৎস (বাংলা)</label>
                      <input
                        type="text"
                        value={newQuote.source.bn}
                        onChange={(e) => setNewQuote({...newQuote, source: {...newQuote.source, bn: e.target.value}})}
                        className="w-full h-10 px-3 rounded-sm border border-stone-200 bg-white text-xs focus:outline-none focus:border-gold-500"
                        placeholder="আল-কুরআন ১৩:২৮"
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full py-3 bg-stone-900 text-gold-500 font-bold rounded-sm text-xs tracking-widest uppercase hover:bg-black transition-colors cursor-pointer">
                    তালিকায় যুক্ত করুন
                  </button>
                </form>

                {/* Quotes List */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-stone-400">বর্তমান ক্যাটালগ ({islamicQuotes.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {islamicQuotes.map((q, idx) => (
                      <div key={idx} className="p-4 rounded-sm border border-stone-200 bg-white relative group text-left">
                        <button
                          onClick={() => handleDeleteQuote(idx)}
                          className="absolute top-2 right-2 p-1.5 rounded-sm bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-red-100 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="space-y-3">
                          <div>
                            <div className="text-[9px] font-bold text-gold-600 uppercase mb-1">ইংরেজি</div>
                            <p className="text-xs italic text-stone-700">"{q.quote.en}"</p>
                            <p className="text-[10px] text-stone-400 mt-1">— {q.source.en}</p>
                          </div>
                          <div className="pt-2 border-t border-stone-100">
                            <div className="text-[9px] font-bold text-gold-600 uppercase mb-1">বাংলা</div>
                            <p className="text-xs text-stone-800 font-sans">"{q.quote.bn}"</p>
                            <p className="text-[10px] text-stone-400 mt-1">— {q.source.bn}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'supabase' && (
              <div className="space-y-6 text-stone-900 text-left">
                {/* Connection Status Card */}
                <div className="p-5 rounded-sm border border-stone-200 bg-stone-50 space-y-4">
                  <div className="text-xs font-bold text-gold-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-stone-200 pb-2">
                    <Database className="w-4 h-4" />
                    <span>সুপাবেস ডাটাবেস ইন্টিগ্রেশন স্ট্যাটাস</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-1">
                      <div className="text-xs text-stone-500 font-sans font-bold">ডাটাবেস কানেকশন</div>
                      <div className="flex items-center gap-2">
                        {supabaseStatus.connected ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" />
                            কানেক্টেড ও সচল
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 border border-red-500/20">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            অফলাইন মোড (লোকাল স্টোরেজ ব্যবহার হচ্ছে)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={refetchFromSupabase}
                        disabled={syncingWithSupabase}
                        className="px-4 py-2 bg-stone-800 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5 transition-all"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncingWithSupabase ? 'animate-spin' : ''}`} />
                        <span>{syncingWithSupabase ? 'সিঙ্ক হচ্ছে...' : 'সুপাবেস থেকে ডাটা আনুন'}</span>
                      </button>

                      <button
                        onClick={syncAllToSupabase}
                        disabled={syncingWithSupabase}
                        className="px-4 py-2 bg-gold-500 hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5 transition-all"
                      >
                        <Server className="w-3.5 h-3.5" />
                        <span>লোকাল ডাটা সুপাবেসে পাঠান</span>
                      </button>
                    </div>
                  </div>

                  {/* Individual Tables Status */}
                  <div className="pt-3">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-2">টেবিল সিঙ্ক ভেরিফিকেশন চেক</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {Object.entries(supabaseStatus.tables).map(([tableName, exists]) => (
                        <div key={tableName} className="p-2.5 rounded-sm border border-stone-200 bg-white flex flex-col justify-between space-y-1 text-center">
                          <span className="text-[10px] font-mono text-stone-600 font-bold break-all">{tableName}</span>
                          <span className={`inline-block mx-auto text-[9px] font-bold uppercase tracking-wider ${
                            exists ? 'text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm' : 'text-stone-450 bg-stone-100 px-1.5 py-0.5 rounded-sm'
                          }`}>
                            {exists ? 'সিঙ্কড' : 'পাওয়া যায়নি'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SQL Schema Setup Guide */}
                <div className="p-5 rounded-sm border border-stone-200 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-150 pb-2">
                    <div className="text-xs font-bold text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-gold-600" />
                      <span>সুপাবেস SQL স্কিমা সেটআপ</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(SUPABASE_SQL_CREATION_QUERY);
                        addToast(
                          { en: 'SQL Schema copied to clipboard successfully!', bn: 'SQL স্কিমা সফলভাবে ক্লিপবোর্ডে কপি করা হয়েছে!' },
                          'success'
                        );
                      }}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>SQL কোড কপি করুন</span>
                    </button>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed font-sans">
                    {language === 'en'
                      ? 'To fully connect Supabase, you must run the following SQL script inside your Supabase project\'s SQL Editor to create all required database tables, enable Row Level Security (RLS) policies, and grant public permissions.'
                      : 'সুপাবেস কানেকশন সফল করতে হলে আপনার Supabase ড্যাশবোর্ডের SQL Editor-এ গিয়ে নিচের কোডটি রান করতে হবে। এটি প্রয়োজনীয় টেবিল, RLS সিকিউরিটি পলিসি এবং পাবলিক পারমিশন তৈরি করবে।'}
                  </p>

                  <div className="relative">
                    <pre className="p-4 bg-stone-900 text-stone-200 font-mono text-[10px] rounded-sm overflow-x-auto overflow-y-auto max-h-60 leading-relaxed scrollbar-thin scrollbar-thumb-stone-700">
                      <code>{SUPABASE_SQL_CREATION_QUERY}</code>
                    </pre>
                  </div>

                  <div className="p-3 bg-gold-500/5 border border-gold-500/20 rounded-sm text-xs text-gold-800/95 font-medium leading-relaxed font-sans">
                    💡 <strong>প্রো টিপ:</strong> SQL সেটআপ সম্পন্ন করার পর, উপরের <strong>"লোকাল ডাটা সুপাবেসে পাঠান"</strong> বাটনে ক্লিক করুন যাতে আপনার বর্তমান প্রোডাক্ট ও অর্ডারগুলো অনলাইনে সেভ হয়ে যায়!
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
