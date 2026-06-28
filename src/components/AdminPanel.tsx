/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Coupon, Order, Review, IslamicQuote, HeroSlide } from '../types';
import {
  X,
  ArrowLeft,
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
  Edit,
  SquarePen,
  Check,
  Percent,
  RefreshCw,
  MoreVertical,
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
import { motion, AnimatePresence } from 'motion/react';
import SmartSelect from './SmartSelect';
import { CATEGORIES } from '../data';
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
    resetAppData,
    language,
    addToast,
    websiteSettings,
    updateWebsiteSettings,
    supabaseStatus,
    syncingWithSupabase,
    syncAllToSupabase,
    refetchFromSupabase,
    islamicQuotes,
    setIslamicQuotes,
    heroSlides,
    setHeroSlides
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'coupons' | 'reviews' | 'quotes' | 'settings' | 'supabase' | 'hero'>('dashboard');

  // Secure Lock System PIN code states
  const [pin, setPin] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('mifta_admin_logged_in') === 'true';
  });

  // Product Editor state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getCategoryName = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return language === 'en' ? (category?.name.en || categoryId) : (category?.name.bn || categoryId);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenuId) setActiveMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

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
    images: [],
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

  const [isAddingHero, setIsAddingHero] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlide | null>(null);
  const [newHeroSlide, setNewHeroSlide] = useState<Omit<HeroSlide, 'id'>>({
    url: '',
    title: { en: '', bn: '' },
    subtitle: { en: '', bn: '' }
  });

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast({ en: 'Please select an image file.', bn: 'দয়া করে একটি ছবি ফাইল নির্বাচন করুন।' }, 'error');
      return;
    }

    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadProductImage(file);
      if (publicUrl) {
        if (isEditing && editingHeroSlide) {
          setEditingHeroSlide({ ...editingHeroSlide, url: publicUrl });
        } else {
          setNewHeroSlide({ ...newHeroSlide, url: publicUrl });
        }
        addToast({ en: 'Hero image uploaded!', bn: 'হিরো ইমেজ আপলোড হয়েছে!' }, 'success');
      }
    } catch (error) {
      console.error(error);
      addToast({ en: 'Upload failed.', bn: 'আপলোড ব্যর্থ হয়েছে।' }, 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroSlide.url) {
      addToast({ en: 'Image is required.', bn: 'ছবি দেওয়া আবশ্যক।' }, 'error');
      return;
    }
    const added: HeroSlide = {
      ...newHeroSlide,
      id: 'slide-' + Math.random().toString(36).substring(2, 9)
    };
    setHeroSlides(prev => [...prev, added]);
    setIsAddingHero(false);
    setNewHeroSlide({ url: '', title: { en: '', bn: '' }, subtitle: { en: '', bn: '' } });
    addToast({ en: 'New hero slide added!', bn: 'নতুন হিরো স্লাইড যোগ করা হয়েছে!' }, 'success');
  };

  const handleUpdateHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHeroSlide || !editingHeroSlide.url) {
      addToast({ en: 'Image is required.', bn: 'ছবি দেওয়া আবশ্যক।' }, 'error');
      return;
    }
    setHeroSlides(prev => prev.map(s => s.id === editingHeroSlide.id ? editingHeroSlide : s));
    setEditingHeroSlide(null);
    addToast({ en: 'Hero slide updated!', bn: 'হিরো স্লাইড আপডেট হয়েছে!' }, 'success');
  };

  const handleDeleteHeroSlide = (id: string) => {
    setHeroSlides(prev => prev.filter(s => s.id !== id));
    addToast({ en: 'Hero slide removed.', bn: 'হিরো স্লাইড মুছে ফেলা হয়েছে।' }, 'info');
  };

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
            <div className="h-14 w-14 rounded-sm border border-gold-500 bg-gold-500/10 flex items-center justify-center animate-pulse">
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
    <div className="fixed inset-0 z-50 bg-stone-50 text-stone-900 flex flex-col h-screen overflow-hidden">
      
      {/* Sticky Top Header */}
      <div className="sticky top-0 bg-white border-b border-stone-200 z-45 w-full shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 shrink-0">
            <img src="/logo.png" alt="Mifta Attar House" className="h-12 w-auto object-contain" />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-bold tracking-tight text-orange-600 leading-none">
                  {language === 'en' ? 'MIFTA' : 'মিফতা'}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-stone-900 text-[8px] font-bold text-white uppercase tracking-wider scale-90">
                  {language === 'en' ? 'ADMIN' : 'অ্যাডমিন'}
                </span>
              </div>
              <span className="text-[9px] font-sans tracking-[0.15em] text-stone-800 font-bold uppercase mt-1 leading-none">
                {language === 'en' ? 'Control Center' : 'কন্ট্রোল সেন্টার'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Supabase status pill */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
              supabaseStatus.connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-stone-50 text-stone-500 border border-stone-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
              {supabaseStatus.connected ? 'Live' : 'Offline'}
            </span>
            
            {/* Logout / Lock system */}
            <button
              onClick={() => {
                localStorage.removeItem('mifta_admin_logged_in');
                setIsAdminLoggedIn(false);
                addToast({ en: 'Logged out of admin panel.', bn: 'অ্যাডমিন প্যানেল থেকে সফলভাবে লগআউট করা হয়েছে।' }, 'info');
                window.dispatchEvent(new Event('storage'));
              }}
              className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-lg border border-red-100 flex items-center gap-1 cursor-pointer transition-all"
              title={language === 'en' ? 'Lock Admin Panel' : 'লগআউট করুন'}
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{language === 'en' ? 'Lock' : 'লগআউট'}</span>
            </button>

            {/* Back / Close Shop Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full border border-stone-200 bg-white text-stone-600 hover:text-stone-950 hover:bg-stone-50 transition-all cursor-pointer shadow-xs"
              title={language === 'en' ? 'Back to Shop' : 'হোমে ফিরে যান'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Header bar for Marketing group (coupons, reviews, quotes) */}
      {['coupons', 'reviews', 'quotes'].includes(activeTab) && (
        <div className="bg-stone-100/50 border-b border-stone-200/80 shrink-0 z-30 py-3 px-4">
          <div className="max-w-7xl mx-auto flex justify-center sm:justify-start">
            <div className="bg-stone-200/60 p-1.5 rounded-2xl flex gap-1 items-center w-full sm:w-auto overflow-x-auto no-scrollbar border border-stone-300/30">
              {[
                { id: 'coupons', label: language === 'bn' ? 'কুপনসমূহ' : 'Coupons', count: coupons.length, icon: Tags },
                { id: 'reviews', label: language === 'bn' ? 'রিভিউসমূহ' : 'Reviews', count: reviews.length, icon: MessageSquare },
                { id: 'quotes', label: language === 'bn' ? 'ইসলামিক বাণী' : 'Quotes', count: islamicQuotes.length, icon: HeartHandshake },
              ].map((subTab) => {
                const Icon = subTab.icon;
                const isSubActive = activeTab === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    onClick={() => setActiveTab(subTab.id as any)}
                    className={`relative flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-none ${
                      isSubActive ? 'text-white' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {isSubActive && (
                      <motion.div
                        layoutId="marketingActiveIndicator"
                        className="absolute inset-0 bg-stone-900 rounded-xl shadow-md z-0"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className={`w-4 h-4 ${isSubActive ? 'text-orange-400' : 'text-orange-600'}`} />
                      <span>{subTab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                        isSubActive ? 'bg-stone-850 text-orange-300' : 'bg-stone-200/80 text-stone-600'
                      }`}>
                        {subTab.count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Header bar for Settings group (hero, settings, supabase) */}
      {['hero', 'settings', 'supabase'].includes(activeTab) && (
        <div className="bg-stone-100/50 border-b border-stone-200/80 shrink-0 z-30 py-3 px-4">
          <div className="max-w-7xl mx-auto flex justify-center sm:justify-start">
            <div className="bg-stone-200/60 p-1.5 rounded-2xl flex gap-1 items-center w-full sm:w-auto overflow-x-auto no-scrollbar border border-stone-300/30">
              {[
                { id: 'hero', label: language === 'bn' ? 'হিরো ব্যানার' : 'Hero Banners', count: heroSlides.length, icon: Image },
                { id: 'settings', label: language === 'bn' ? 'ওয়েবসাইটের লেখা' : 'Website Content', icon: RefreshCw },
                { id: 'supabase', label: language === 'bn' ? 'সুপাবেস ডাটাবেস' : 'Database Setup', icon: Database },
              ].map((subTab) => {
                const Icon = subTab.icon;
                const isSubActive = activeTab === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    onClick={() => setActiveTab(subTab.id as any)}
                    className={`relative flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-none ${
                      isSubActive ? 'text-white' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {isSubActive && (
                      <motion.div
                        layoutId="settingsActiveIndicator"
                        className="absolute inset-0 bg-stone-900 rounded-xl shadow-md z-0"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className={`w-4 h-4 ${isSubActive ? 'text-orange-400' : 'text-orange-600'}`} />
                      <span>{subTab.label}</span>
                      {subTab.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                          isSubActive ? 'bg-stone-850 text-orange-300' : 'bg-stone-200/80 text-stone-600'
                        }`}>
                          {subTab.count}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto bg-stone-50/40 min-h-0 pb-6">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 w-full">
            
            {/* Tab 1: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Metrics Grid - Modern Bento Design */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { label: 'মোট রাজস্ব', value: `৳${totalRevenue.toLocaleString()}`, sub: '+১৫% গত সপ্তাহ', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'সক্রিয় অর্ডার', value: orders.filter(o => o.orderStatus !== 'delivered').length, sub: '৫টি প্রসেসিং হচ্ছে', icon: ShoppingBag, color: 'text-gold-600', bg: 'bg-gold-50' },
                    { label: 'মোট কাস্টমার', value: '২৮৪', sub: '+১২ নতুন আজ', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'স্টক অ্যালার্ট', value: products.filter(p => p.stock < 10).length, sub: 'রিফিল প্রয়োজন', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 bg-white border border-stone-200 rounded-sm shadow-sm group hover:border-gold-500/30 transition-all cursor-default"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2.5 rounded-sm ${stat.bg} ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">
                          {stat.sub}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.1em]">{stat.label}</p>
                        <p className="text-2xl font-serif font-bold text-stone-900 tracking-tight">{stat.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Recent Activity Section */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-gold-500" />
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-stone-900">সাম্প্রতিক অর্ডার সমূহ (Recent Orders)</h3>
                      </div>
                      <button onClick={() => setActiveTab('orders')} className="text-[10px] font-bold text-gold-600 uppercase hover:underline tracking-widest">সকল অর্ডার দেখুন</button>
                    </div>
                    <div className="bg-white border border-stone-200 rounded-sm divide-y divide-stone-100 shadow-sm overflow-hidden">
                      {orders.slice(0, 5).length > 0 ? (
                        orders.slice(0, 5).map(order => (
                          <div key={order.id} className="p-5 flex items-center justify-between hover:bg-stone-50/50 transition-colors group">
                            <div className="flex items-center gap-5">
                              <div className="h-12 w-12 rounded-sm bg-stone-100 flex items-center justify-center text-xs font-mono font-bold text-stone-400 group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                                #{order.id.slice(-4)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-stone-900 group-hover:text-gold-700 transition-colors">{order.customerName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-[10px] text-stone-400 font-mono uppercase">{new Date(order.date).toLocaleDateString()}</p>
                                  <span className="text-stone-200">|</span>
                                  <p className="text-[10px] text-stone-400 uppercase tracking-tighter">{order.items.length} আইটেম</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-stone-900 font-mono">৳{order.total.toLocaleString()}</p>
                              <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                                order.orderStatus === 'delivered' ? 'bg-emerald-500 text-white' : 'bg-gold-500 text-black'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center text-stone-400 text-xs uppercase font-bold tracking-widest">
                          কোন অর্ডার পাওয়া যায়নি
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar Tools */}
                  <div className="lg:col-span-4 space-y-6">


                    {/* Stock Alert Mini Widget */}
                    <div className="p-6 bg-orange-50 border border-orange-100 rounded-sm space-y-4">
                      <div className="flex items-center gap-2 text-orange-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">স্টক ওয়ার্নিং (Stock Warning)</span>
                      </div>
                      <div className="space-y-3">
                        {products.filter(p => p.stock < 5).slice(0, 3).map(p => (
                          <div key={p.id} className="flex justify-between items-center text-[11px]">
                            <span className="text-stone-600 font-bold truncate pr-4">{language === 'bn' ? p.name.bn : p.name.en}</span>
                            <span className="text-orange-600 font-mono font-bold shrink-0">{p.stock}টি অবশিষ্ট</span>
                          </div>
                        ))}
                        {products.filter(p => p.stock < 5).length === 0 && (
                          <p className="text-[10px] text-stone-400 text-center uppercase py-2">সকল পণ্যের পর্যাপ্ত স্টক আছে</p>
                        )}
                      </div>
                    </div>
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

                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-sm border border-stone-200 bg-stone-50 space-y-3 text-xs">
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-stone-200 pb-2">
                        <div>
                          <span className="font-bold text-gold-600 font-mono text-sm">{ord.id}</span>
                          <span className="text-stone-500 ml-2 font-mono">
                            {new Date(ord.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            <span className="mx-1.5 opacity-30">|</span>
                            <span className="text-gold-600 font-bold">
                              {new Date(ord.date).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </span>
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
                          {ord.transactionId && (
                            <p className="font-sans text-[11px] text-emerald-600 font-bold">
                              TXID: {ord.transactionId} {ord.advancePaidAmount ? `| অগ্রিম: ৳${ord.advancePaidAmount}` : ''}
                            </p>
                          )}
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
                
                {/* Add New Product Button */}
                {!editingProduct && !isAddingProduct && (
                  <button
                    onClick={() => setIsAddingProduct(true)}
                    className="w-full py-4 border-2 border-dashed border-gold-500/30 rounded-sm bg-gold-500/5 hover:bg-gold-500/10 text-gold-600 flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-full bg-gold-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest">নতুন পণ্য যোগ করুন (Add New Product)</span>
                  </button>
                )}

                {/* Product Form: conditional between Edit and Add */}
                {editingProduct ? (
                  <div className="fixed inset-0 z-[100] bg-white w-screen h-screen overflow-y-auto">
                    {/* Header for Edit Product Screen */}
                    <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="p-1.5 rounded-full border border-stone-200 text-stone-600 hover:text-stone-950 hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                          <h3 className="font-serif text-sm sm:text-base font-bold text-stone-850 tracking-wide leading-tight">পণ্য সম্পাদনা করুন</h3>
                          <p className="text-[9px] uppercase font-bold tracking-widest text-stone-400 mt-0.5">
                            {editingProduct.name.bn}
                          </p>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-1.5 bg-[#F97316] hover:bg-[#F97316]/90 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer transition-all"
                      >
                        সেইভ
                      </button>
                    </div>

                    <div className="w-full pb-32">
                      <div className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8">
                        <form onSubmit={handleSaveEditProduct} className="space-y-6">
                          
                          {/* 1. Image & Primary Info Section */}
                          <div className="bg-stone-50/50 p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-xs">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                              
                              {/* Left: Image Upload & Preview */}
                              <div className="lg:col-span-4 space-y-4">
                                <div className="flex items-center gap-2 text-stone-800 mb-2">
                                  <div className="h-8 w-8 rounded-lg border border-orange-200 bg-orange-50 flex items-center justify-center">
                                    <Image className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <h3 className="font-bold text-xs uppercase tracking-wider">পণ্যের ছবি (Product Image)</h3>
                                </div>

                                <div className="relative group cursor-pointer">
                                  <input
                                    type="file"
                                    id="edit-product-image-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleLocalFileUpload(e, true)}
                                  />
                                  <label 
                                    htmlFor="edit-product-image-upload"
                                    className={`block relative ${editingProduct.images[0] ? 'aspect-video' : 'aspect-square h-40'} w-full border-2 border-dashed border-stone-200 rounded-xl bg-white overflow-hidden transition-all hover:border-orange-500/50 hover:bg-stone-50 cursor-pointer shadow-sm`}
                                  >
                                    {editingProduct.images[0] ? (
                                      <>
                                        <img 
                                          src={editingProduct.images[0]} 
                                          alt="Preview" 
                                          className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Invalid+Image+URL';
                                          }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity backdrop-blur-[2px]">
                                          <RefreshCw className="w-8 h-8 text-white mb-2" />
                                          <span className="text-[10px] text-white font-bold uppercase tracking-widest">পরিবর্তন করতে ক্লিক করুন</span>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="h-full flex flex-col items-center justify-center space-y-4 text-stone-400">
                                        <div className="h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                          <Plus className="w-8 h-8 text-stone-300" />
                                        </div>
                                        <div className="text-center">
                                          <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500">ছবি যুক্ত করুন</p>
                                          <p className="text-[9px] uppercase tracking-tighter mt-1">ক্লিক করুন অথবা ড্র্যাগ করুন</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {isUploadingImage && (
                                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                        <RefreshCw className="w-6 h-6 text-orange-600 animate-spin" />
                                      </div>
                                    )}
                                  </label>
                                </div>
                              </div>

                              {/* Right: Primary Fields */}
                              <div className="lg:col-span-7 space-y-5 text-left">
                                <div className="flex items-center gap-2 text-stone-800 mb-2">
                                  <div className="h-8 w-8 rounded-lg border border-orange-200 bg-orange-50 flex items-center justify-center">
                                    <ShoppingBag className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <h3 className="font-bold text-xs uppercase tracking-wider">প্রাথমিক তথ্য (Primary Info)</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="edit-p-name-en"
                                      required
                                      placeholder=" "
                                      value={editingProduct.name.en}
                                      onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, en: e.target.value } })}
                                      className="peer w-full h-11 px-3.5 pt-4 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 font-medium placeholder-transparent transition-all"
                                    />
                                    <label 
                                      htmlFor="edit-p-name-en"
                                      className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none"
                                    >
                                      পণ্যের নাম (English) *
                                    </label>
                                  </div>

                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="edit-p-name-bn"
                                      required
                                      placeholder=" "
                                      value={editingProduct.name.bn}
                                      onChange={(e) => setNewProduct({ ...editingProduct, name: { ...editingProduct.name, bn: e.target.value } })}
                                      className="peer w-full h-11 px-3.5 pt-4 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 font-medium placeholder-transparent transition-all"
                                    />
                                    <label 
                                      htmlFor="edit-p-name-bn"
                                      className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none"
                                    >
                                      পণ্যের নাম (বাংলা) *
                                    </label>
                                  </div>
                                </div>

                                <div className="relative">
                                  <SmartSelect
                                    label="ক্যাটাগরি"
                                    value={editingProduct.category}
                                    onChange={(val) => setEditingProduct({ ...editingProduct, category: val })}
                                    options={[
                                      { value: 'oud', label: 'উদ কালেকশন' },
                                      { value: 'arabic', label: 'অ্যারাবিক আতর' },
                                      { value: 'floral', label: 'ফ্লোরাল কালেকশন' },
                                      { value: 'fresh', label: 'স্পোর্টি ও ফ্রেশ' },
                                      { value: 'natural', label: 'ন্যাচারাল ও হেলথ' },
                                      { value: 'gifts', label: 'গিফট বক্স' },
                                    ]}
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="relative">
                                    <input
                                      type="number"
                                      id="edit-p-price"
                                      required
                                      placeholder=" "
                                      value={editingProduct.price}
                                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                      className="peer w-full h-11 px-3.5 pt-4 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 font-mono font-bold placeholder-transparent transition-all"
                                    />
                                    <label 
                                      htmlFor="edit-p-price"
                                      className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none"
                                    >
                                      মূল্য (৳) *
                                    </label>
                                  </div>

                                  <div className="relative">
                                    <input
                                      type="number"
                                      id="edit-p-stock"
                                      required
                                      placeholder=" "
                                      value={editingProduct.stock}
                                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                                      className="peer w-full h-11 px-3.5 pt-4 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 font-mono font-bold placeholder-transparent transition-all"
                                    />
                                    <label 
                                      htmlFor="edit-p-stock"
                                      className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none"
                                    >
                                      স্টক পরিমাণ *
                                    </label>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* 2. Description Section */}
                          <div className="bg-stone-50/50 p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-xs text-left">
                            <div className="flex items-center gap-2 text-stone-800 mb-4">
                              <div className="h-8 w-8 rounded-lg border border-orange-200 bg-orange-50 flex items-center justify-center">
                                <Package className="w-4 h-4 text-orange-600" />
                              </div>
                              <h3 className="font-bold text-xs uppercase tracking-wider">পণ্যের বিবরণ (Description)</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1.5">
                                <div className="relative">
                                  <textarea
                                    id="edit-p-desc-en"
                                    required
                                    placeholder=" "
                                    value={editingProduct.description.en}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, en: e.target.value } })}
                                    className="peer w-full h-28 p-3.5 pt-6 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 placeholder-transparent transition-all"
                                  />
                                  <label 
                                    htmlFor="edit-p-desc-en"
                                    className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none uppercase tracking-widest"
                                  >
                                    পণ্যের বিবরণ (English) *
                                  </label>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <div className="relative">
                                  <textarea
                                    id="edit-p-desc-bn"
                                    required
                                    placeholder=" "
                                    value={editingProduct.description.bn}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, bn: e.target.value } })}
                                    className="peer w-full h-28 p-3.5 pt-6 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 placeholder-transparent transition-all"
                                  />
                                  <label 
                                    htmlFor="edit-p-desc-bn"
                                    className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none uppercase tracking-widest"
                                  >
                                    পণ্যের বিবরণ (বাংলা) *
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. Badges & Sales Promotions */}
                          <div className="bg-stone-50/50 p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-xs text-left">
                            <div className="flex items-center gap-2 text-stone-800 mb-4">
                              <div className="h-8 w-8 rounded-lg border border-orange-200 bg-orange-50 flex items-center justify-center">
                                <Tags className="w-4 h-4 text-orange-600" />
                              </div>
                              <h3 className="font-bold text-xs uppercase tracking-wider">ট্যাগ ও ডিসকাউন্ট (Badges & Sale Promotions)</h3>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white border border-stone-200/60 rounded-xl">
                              <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                                <input type="checkbox" className="accent-orange-600 h-4 w-4" id="edit-best" checked={editingProduct.isBestSeller} onChange={(e) => setEditingProduct({...editingProduct, isBestSeller: e.target.checked})} />
                                <span className="text-[10px] font-bold text-stone-600 uppercase">বেস্ট সেলার</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                                <input type="checkbox" className="accent-orange-600 h-4 w-4" id="edit-new" checked={editingProduct.isNewArrival} onChange={(e) => setEditingProduct({...editingProduct, isNewArrival: e.target.checked})} />
                                <span className="text-[10px] font-bold text-stone-600 uppercase">নতুন কালেকশন</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                                <input type="checkbox" className="accent-orange-600 h-4 w-4" id="edit-trend" checked={editingProduct.isTrending} onChange={(e) => setEditingProduct({...editingProduct, isTrending: e.target.checked})} />
                                <span className="text-[10px] font-bold text-stone-600 uppercase">ট্রেন্ডিং</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none text-orange-600 font-bold">
                                <input type="checkbox" className="accent-orange-600 h-4 w-4" id="edit-flash" checked={editingProduct.isFlashSale} onChange={(e) => setEditingProduct({...editingProduct, isFlashSale: e.target.checked})} />
                                <span className="text-[10px] uppercase">ফ্ল্যাশ সেল</span>
                              </label>
                            </div>

                            {editingProduct.isFlashSale && (
                              <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-1.5 max-w-sm">
                                <label className="block text-[10px] uppercase font-bold text-orange-600">ফ্ল্যাশ সেল ডিসকাউন্ট (%)</label>
                                <input
                                  type="number"
                                  value={editingProduct.flashSaleDiscount || 0}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, flashSaleDiscount: Number(e.target.value) })}
                                  className="w-full h-10 px-3 rounded-lg bg-white border border-orange-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 font-mono font-bold"
                                />
                              </div>
                            )}
                          </div>

                          {/* Submit / Cancel Buttons */}
                          <div className="flex gap-4 pt-4 border-t border-stone-100">
                            <button
                              type="submit"
                              className="flex-1 py-3 bg-[#F97316] hover:bg-orange-700 text-white font-bold rounded-xl text-xs tracking-wider uppercase cursor-pointer shadow-md shadow-orange-600/10 transition-all"
                            >
                              পরিবর্তনগুলো সংরক্ষণ করুন
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProduct(null)}
                              className="px-8 py-3 border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 font-bold rounded-xl text-xs tracking-wider uppercase cursor-pointer transition-all"
                            >
                              বাতিল
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : isAddingProduct ? (
                  <div className="fixed inset-0 z-[100] bg-white w-screen h-screen overflow-y-auto">
                    {/* Header for Add Product Screen */}
                    <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => setIsAddingProduct(false)}
                          className="p-1.5 rounded-full border border-stone-200 text-stone-600 hover:text-stone-950 hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                          <h3 className="font-serif text-sm sm:text-base font-bold text-stone-850 tracking-wide leading-tight">নতুন পণ্য যোগ করুন</h3>
                          <p className="text-[9px] uppercase font-bold tracking-widest text-stone-400 mt-0.5">ইনভেন্টরি ম্যানেজমেন্ট সিস্টেম</p>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-1.5 bg-[#F97316] hover:bg-[#F97316]/90 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer transition-all"
                      >
                        সেইভ
                      </button>
                    </div>

                    <div className="w-full pb-32">
                      <div className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8">
                        <form onSubmit={(e) => {
                          handleAddProduct(e);
                          setIsAddingProduct(false);
                        }} className="space-y-6">
                          
                          {/* 1. Image & Primary Info Section */}
                          <div className="bg-stone-50/50 p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-xs">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                              
                              {/* Left: Image Upload & Preview */}
                              <div className="lg:col-span-4 space-y-4">
                                <div className="flex items-center gap-2 text-stone-800 mb-2">
                                  <div className="h-8 w-8 rounded-lg border border-orange-200 bg-orange-50 flex items-center justify-center">
                                    <Image className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <h3 className="font-bold text-xs uppercase tracking-wider">পণ্যের ছবি (Product Image)</h3>
                                </div>

                                <div className="relative group cursor-pointer">
                                  <input
                                    type="file"
                                    id="add-product-image-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleLocalFileUpload(e, false)}
                                  />
                                  <label 
                                    htmlFor="add-product-image-upload"
                                    className={`block relative ${newProduct.images[0] ? 'aspect-video' : 'aspect-square h-40'} w-full border-2 border-dashed border-stone-200 rounded-xl bg-white overflow-hidden transition-all hover:border-orange-500/50 hover:bg-stone-50 cursor-pointer shadow-sm`}
                                  >
                                    {newProduct.images[0] ? (
                                      <>
                                        <img 
                                          src={newProduct.images[0]} 
                                          alt="Preview" 
                                          className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Invalid+Image+URL';
                                          }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity backdrop-blur-[2px]">
                                          <RefreshCw className="w-8 h-8 text-white mb-2" />
                                          <span className="text-[10px] text-white font-bold uppercase tracking-widest">পরিবর্তন করতে ক্লিক করুন</span>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="h-full flex flex-col items-center justify-center space-y-4 text-stone-400">
                                        <div className="h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                          <Plus className="w-8 h-8 text-stone-300" />
                                        </div>
                                        <div className="text-center">
                                          <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500">ছবি যুক্ত করুন</p>
                                          <p className="text-[9px] uppercase tracking-tighter mt-1">ক্লিক করুন অথবা ড্র্যাগ করুন</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {isUploadingImage && (
                                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                        <RefreshCw className="w-6 h-6 text-orange-600 animate-spin" />
                                      </div>
                                    )}
                                  </label>
                                </div>
                              </div>

                              {/* Right: Primary Fields */}
                              <div className="lg:col-span-7 space-y-5 text-left">
                                <div className="flex items-center gap-2 text-stone-800 mb-2">
                                  <div className="h-8 w-8 rounded-lg border border-orange-200 bg-orange-50 flex items-center justify-center">
                                    <ShoppingBag className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <h3 className="font-bold text-xs uppercase tracking-wider">প্রাথমিক তথ্য (Primary Info)</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="add-p-name-en"
                                      required
                                      placeholder=" "
                                      value={newProduct.name.en}
                                      onChange={(e) => setNewProduct({ ...newProduct, name: { ...newProduct.name, en: e.target.value } })}
                                      className="peer w-full h-11 px-3.5 pt-4 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 font-medium placeholder-transparent transition-all"
                                    />
                                    <label 
                                      htmlFor="add-p-name-en"
                                      className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none"
                                    >
                                      পণ্যের নাম (English) *
                                    </label>
                                  </div>

                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="add-p-name-bn"
                                      required
                                      placeholder=" "
                                      value={newProduct.name.bn}
                                      onChange={(e) => setNewProduct({ ...newProduct, name: { ...newProduct.name, bn: e.target.value } })}
                                      className="peer w-full h-11 px-3.5 pt-4 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 font-medium placeholder-transparent transition-all"
                                    />
                                    <label 
                                      htmlFor="add-p-name-bn"
                                      className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none"
                                    >
                                      পণ্যের নাম (বাংলা) *
                                    </label>
                                  </div>
                                </div>

                                <div className="relative">
                                  <SmartSelect
                                    label="ক্যাটাগরি"
                                    value={newProduct.category}
                                    onChange={(val) => setNewProduct({ ...newProduct, category: val })}
                                    options={[
                                      { value: 'oud', label: 'উদ কালেকশন' },
                                      { value: 'arabic', label: 'অ্যারাবিক আতর' },
                                      { value: 'floral', label: 'ফ্লোরাল কালেকশন' },
                                      { value: 'fresh', label: 'স্পোর্টি ও ফ্রেশ' },
                                      { value: 'natural', label: 'ন্যাচারাল ও হেলথ' },
                                      { value: 'gifts', label: 'গিফট বক্স' },
                                    ]}
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="relative">
                                    <input
                                      type="number"
                                      id="add-p-price"
                                      required
                                      placeholder=" "
                                      value={newProduct.price}
                                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                      className="peer w-full h-11 px-3.5 pt-4 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 font-mono font-bold placeholder-transparent transition-all"
                                    />
                                    <label 
                                      htmlFor="add-p-price"
                                      className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none"
                                    >
                                      মূল্য (৳) *
                                    </label>
                                  </div>

                                  <div className="relative">
                                    <input
                                      type="number"
                                      id="add-p-stock"
                                      required
                                      placeholder=" "
                                      value={newProduct.stock}
                                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                                      className="peer w-full h-11 px-3.5 pt-4 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 font-mono font-bold placeholder-transparent transition-all"
                                    />
                                    <label 
                                      htmlFor="add-p-stock"
                                      className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none"
                                    >
                                      স্টক পরিমাণ *
                                    </label>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* 2. Description Section */}
                          <div className="bg-stone-50/50 p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-xs text-left">
                            <div className="flex items-center gap-2 text-stone-800 mb-4">
                              <div className="h-8 w-8 rounded-lg border border-orange-200 bg-orange-50 flex items-center justify-center">
                                <Package className="w-4 h-4 text-orange-600" />
                              </div>
                              <h3 className="font-bold text-xs uppercase tracking-wider">পণ্যের বিবরণ (Description)</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1.5">
                                <div className="relative">
                                  <textarea
                                    id="add-p-desc-en"
                                    required
                                    placeholder=" "
                                    value={newProduct.description.en}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: { ...newProduct.description, en: e.target.value } })}
                                    className="peer w-full h-28 p-3.5 pt-6 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 placeholder-transparent transition-all"
                                  />
                                  <label 
                                    htmlFor="add-p-desc-en"
                                    className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none uppercase tracking-widest"
                                  >
                                    পণ্যের বিবরণ (English) *
                                  </label>
                                </div>

                              </div>

                              <div className="relative">
                                <textarea
                                  id="add-p-desc-bn"
                                  required
                                  placeholder=" "
                                  value={newProduct.description.bn}
                                  onChange={(e) => setNewProduct({ ...newProduct, description: { ...newProduct.description, bn: e.target.value } })}
                                  className="peer w-full h-28 p-3.5 pt-6 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 placeholder-transparent transition-all"
                                />
                                <label 
                                  htmlFor="add-p-desc-bn"
                                  className="absolute left-3.5 -top-2 px-1 bg-white text-[9px] font-bold text-stone-400 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-300 peer-focus:-top-2 peer-focus:left-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-orange-600 pointer-events-none uppercase tracking-widest"
                                >
                                  পণ্যের বিবরণ (বাংলা) *
                                </label>
                              </div>

                            </div>
                          </div>

                          {/* 3. Badges & Sales Promotions */}
                          <div className="bg-stone-50/50 p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-xs text-left">
                            <div className="flex items-center gap-2 text-stone-800 mb-4">
                              <div className="h-8 w-8 rounded-lg border border-orange-200 bg-orange-50 flex items-center justify-center">
                                <Tags className="w-4 h-4 text-orange-600" />
                              </div>
                              <h3 className="font-bold text-xs uppercase tracking-wider">ট্যাগ ও ডিসকাউন্ট (Badges & Sale Promotions)</h3>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white border border-stone-200/60 rounded-xl">
                              <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                                <input type="checkbox" className="accent-orange-600 h-4 w-4" id="add-best" checked={newProduct.isBestSeller} onChange={(e) => setNewProduct({...newProduct, isBestSeller: e.target.checked})} />
                                <span className="text-[10px] font-bold text-stone-600 uppercase">বেস্ট সেলার</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                                <input type="checkbox" className="accent-orange-600 h-4 w-4" id="add-new" checked={newProduct.isNewArrival} onChange={(e) => setNewProduct({...newProduct, isNewArrival: e.target.checked})} />
                                <span className="text-[10px] font-bold text-stone-600 uppercase">নতুন কালেকশন</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                                <input type="checkbox" className="accent-orange-600 h-4 w-4" id="add-trend" checked={newProduct.isTrending} onChange={(e) => setNewProduct({...newProduct, isTrending: e.target.checked})} />
                                <span className="text-[10px] font-bold text-stone-600 uppercase">ট্রেন্ডিং</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none text-orange-600 font-bold">
                                <input type="checkbox" className="accent-orange-600 h-4 w-4" id="add-flash" checked={newProduct.isFlashSale} onChange={(e) => setNewProduct({...newProduct, isFlashSale: e.target.checked})} />
                                <span className="text-[10px] uppercase">ফ্ল্যাশ সেল</span>
                              </label>
                            </div>

                            {newProduct.isFlashSale && (
                              <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-1.5 max-w-sm">
                                <label className="block text-[10px] uppercase font-bold text-orange-600">ফ্ল্যাশ সেল ডিসকাউন্ট (%)</label>
                                <input
                                  type="number"
                                  value={newProduct.flashSaleDiscount || 0}
                                  onChange={(e) => setNewProduct({ ...newProduct, flashSaleDiscount: Number(e.target.value) })}
                                  className="w-full h-10 px-3 rounded-lg bg-white border border-orange-200 text-xs focus:outline-none focus:border-orange-500 text-stone-900 font-mono font-bold"
                                />
                              </div>
                            )}
                          </div>

                          {/* Submit / Cancel Buttons */}
                          <div className="flex gap-4 pt-4 border-t border-stone-100">
                            <button
                              type="submit"
                              className="flex-1 py-3 bg-[#F97316] hover:bg-orange-700 text-white font-bold rounded-xl text-xs tracking-wider uppercase cursor-pointer shadow-md shadow-orange-600/10 transition-all"
                            >
                              নতুন পণ্য তালিকায় যুক্ত করুন
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAddingProduct(false)}
                              className="px-8 py-3 border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 font-bold rounded-xl text-xs tracking-wider uppercase cursor-pointer transition-all"
                            >
                              বাতিল
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Products List & Stock editor */}
                <div className="space-y-3.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">স্টোর ক্যাটালগ ইনভেন্টরি ({products.length})</h4>
                  <div className="space-y-2.5">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center gap-4 py-4 px-3 rounded-sm border border-stone-200 bg-stone-50 text-xs text-left">
                        <img src={p.images[0]} className="w-10 h-10 object-cover rounded-sm border border-stone-200" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-stone-950 truncate">{language === 'en' ? p.name.en : p.name.bn}</h5>
                          <p className="text-[10px] text-stone-500 font-bold uppercase">
                            {language === 'en' ? 'Category' : 'ক্যাটাগরি'}: {getCategoryName(p.category)}
                          </p>
                          <span className="text-[10px] text-gold-600 font-mono font-bold">
                            {language === 'en' ? 'Price' : 'মূল্য'}: {p.price} {language === 'en' ? '' : 'টাকা'}
                          </span>
                        </div>
                        
                        {/* Stock Adjustment Input */}
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-stone-500 font-bold uppercase hidden sm:inline">Stock:</span>
                          <input
                            type="number"
                            value={p.stock}
                            onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                            className="w-14 h-8 rounded-sm bg-white border border-stone-200 text-center font-bold font-mono text-stone-900 focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === p.id ? null : p.id); }}
                            className="text-stone-400 hover:text-stone-600 p-1"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {activeMenuId === p.id && (
                            <div className="absolute right-0 top-8 z-10 w-28 bg-white border border-stone-200 shadow-lg rounded-sm py-1">
                               <button 
                                 onClick={() => { setEditingProduct(p); setActiveMenuId(null); }}
                                 className="w-full text-left px-4 py-2 text-xs hover:bg-stone-100 flex items-center gap-2 text-stone-700"
                               >
                                 <SquarePen className="w-3 h-3" /> এডিট
                               </button>
                               <button
                                 onClick={() => { handleDeleteProduct(p.id); setActiveMenuId(null); }}
                                 className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                               >
                                 <Trash2 className="w-3 h-3" /> ডিলিট
                               </button>
                            </div>
                          )}
                        </div>
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
                      <SmartSelect
                        label="ডিসকাউন্ট ধরন"
                        value={newCoupon.discountType}
                        onChange={(val) => setNewCoupon({ ...newCoupon, discountType: val as any })}
                        options={[
                          { value: 'percentage', label: 'শতকরা (%)' },
                          { value: 'fixed', label: 'নির্দিষ্ট টাকা (৳)' },
                        ]}
                      />
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
                  <div className="space-y-2.5">
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

                  <div className="space-y-3">
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

            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-2 text-left">
                  <h3 className="font-bold text-sm text-stone-900 uppercase tracking-widest">হিরো ব্যানার ম্যানেজমেন্ট</h3>
                  <span className="text-[10px] text-stone-500 font-mono bg-stone-100 px-2 py-1 rounded-sm uppercase font-bold">হোমপেজ স্লাইডার</span>
                </div>

                {/* Add/Edit Slide Form */}
                <form 
                  onSubmit={editingHeroSlide ? handleUpdateHeroSlide : handleAddHeroSlide} 
                  className={`p-4 sm:p-5 rounded-sm border space-y-4 shadow-sm text-left transition-all ${editingHeroSlide ? 'border-gold-500 bg-gold-50/30' : 'border-stone-200 bg-stone-50'}`}
                >
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2 mb-2">
                    <div className="text-[10px] font-bold text-gold-600 uppercase tracking-widest flex items-center gap-2">
                      {editingHeroSlide ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{editingHeroSlide ? 'স্লাইড এডিট করুন' : 'নতুন স্লাইড যুক্ত করুন'}</span>
                    </div>
                    {editingHeroSlide && (
                      <button 
                        type="button"
                        onClick={() => setEditingHeroSlide(null)}
                        className="text-[9px] uppercase font-bold text-stone-400 hover:text-stone-600"
                      >
                        বাতিল করুন
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-[9px] uppercase font-bold text-stone-500">ব্যানার ছবি *</label>
                      <div className="flex items-center gap-3">
                        <div className="relative w-full">
                          <input
                            type="text"
                            required
                            placeholder="Image URL"
                            value={editingHeroSlide ? editingHeroSlide.url : newHeroSlide.url}
                            onChange={(e) => {
                              if (editingHeroSlide) setEditingHeroSlide({...editingHeroSlide, url: e.target.value});
                              else setNewHeroSlide({...newHeroSlide, url: e.target.value});
                            }}
                            className="w-full h-10 px-3 rounded-sm border border-stone-200 bg-white text-xs focus:outline-none focus:border-gold-500"
                          />
                        </div>
                        <label className="shrink-0 h-10 px-4 bg-stone-900 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-sm flex items-center justify-center cursor-pointer hover:bg-black transition-all">
                          {isUploadingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleHeroImageUpload(e, !!editingHeroSlide)} />
                        </label>
                      </div>
                      {(editingHeroSlide ? editingHeroSlide.url : newHeroSlide.url) && (
                        <div className="mt-2 h-32 w-full overflow-hidden rounded-sm border border-stone-200 bg-stone-100">
                          <img src={editingHeroSlide ? editingHeroSlide.url : newHeroSlide.url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase font-bold text-stone-500">শিরোনাম (ইংরেজি)</label>
                      <input
                        type="text"
                        value={editingHeroSlide ? editingHeroSlide.title.en : newHeroSlide.title.en}
                        onChange={(e) => {
                          if (editingHeroSlide) setEditingHeroSlide({...editingHeroSlide, title: {...editingHeroSlide.title, en: e.target.value}});
                          else setNewHeroSlide({...newHeroSlide, title: {...newHeroSlide.title, en: e.target.value}});
                        }}
                        className="w-full h-10 px-3 rounded-sm border border-stone-200 bg-white text-xs focus:outline-none focus:border-gold-500"
                        placeholder="Premium Collection"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase font-bold text-stone-500">শিরোনাম (বাংলা)</label>
                      <input
                        type="text"
                        value={editingHeroSlide ? editingHeroSlide.title.bn : newHeroSlide.title.bn}
                        onChange={(e) => {
                          if (editingHeroSlide) setEditingHeroSlide({...editingHeroSlide, title: {...editingHeroSlide.title, bn: e.target.value}});
                          else setNewHeroSlide({...newHeroSlide, title: {...newHeroSlide.title, bn: e.target.value}});
                        }}
                        className="w-full h-10 px-3 rounded-sm border border-stone-200 bg-white text-xs focus:outline-none focus:border-gold-500"
                        placeholder="প্রিমিয়াম কালেকশন"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase font-bold text-stone-500">সাবটাইটেল (ইংরেজি)</label>
                      <input
                        type="text"
                        value={editingHeroSlide ? editingHeroSlide.subtitle.en : newHeroSlide.subtitle.en}
                        onChange={(e) => {
                          if (editingHeroSlide) setEditingHeroSlide({...editingHeroSlide, subtitle: {...editingHeroSlide.subtitle, en: e.target.value}});
                          else setNewHeroSlide({...newHeroSlide, subtitle: {...newHeroSlide.subtitle, en: e.target.value}});
                        }}
                        className="w-full h-10 px-3 rounded-sm border border-stone-200 bg-white text-xs focus:outline-none focus:border-gold-500"
                        placeholder="Pure Fragrance"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase font-bold text-stone-500">সাবটাইটেল (বাংলা)</label>
                      <input
                        type="text"
                        value={editingHeroSlide ? editingHeroSlide.subtitle.bn : newHeroSlide.subtitle.bn}
                        onChange={(e) => {
                          if (editingHeroSlide) setEditingHeroSlide({...editingHeroSlide, subtitle: {...editingHeroSlide.subtitle, bn: e.target.value}});
                          else setNewHeroSlide({...newHeroSlide, subtitle: {...newHeroSlide.subtitle, bn: e.target.value}});
                        }}
                        className="w-full h-10 px-3 rounded-sm border border-stone-200 bg-white text-xs focus:outline-none focus:border-gold-500"
                        placeholder="বিশুদ্ধ সুবাস"
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full py-3 bg-stone-900 text-gold-500 font-bold rounded-sm text-xs tracking-widest uppercase hover:bg-black transition-colors cursor-pointer">
                    {editingHeroSlide ? 'হিরো ব্যানার আপডেট করুন' : 'স্লাইড যুক্ত করুন'}
                  </button>
                </form>

                {/* Slides List */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-stone-400 text-left">বর্তমান স্লাইড সমূহ ({heroSlides.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {heroSlides.map((slide) => (
                      <div key={slide.id} className={`rounded-sm border overflow-hidden group text-left transition-all ${editingHeroSlide?.id === slide.id ? 'border-gold-500 shadow-lg scale-[1.02]' : 'border-stone-200 bg-white'}`}>
                        <div className="h-40 w-full relative overflow-hidden">
                          <img src={slide.url} alt={slide.title.en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                            <button
                              onClick={() => setEditingHeroSlide(slide)}
                              className="p-2 rounded-sm bg-white text-stone-600 border border-stone-200 hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-all cursor-pointer shadow-md"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteHeroSlide(slide.id)}
                              className="p-2 rounded-sm bg-white text-red-500 border border-stone-200 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-md"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                            <p className="text-white font-bold text-xs">{slide.title.bn || 'Untitled'}</p>
                            <p className="text-white/70 text-[10px]">{slide.subtitle.bn || 'No subtitle'}</p>
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

      {/* Sticky Bottom Navigation Bar */}
      {!isAddingProduct && !editingProduct && (
        <div className="sticky bottom-0 left-0 right-0 bg-[#F97316] text-white border-t border-orange-600 shadow-[0_-4px_20px_rgba(249,115,22,0.3)] z-45 shrink-0 pb-safe rounded-t-2xl">
          <div className="max-w-7xl mx-auto px-2 h-16 flex items-center justify-around relative">
            {[
              { id: 'dashboard', target: 'dashboard', label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', target: 'orders', label: language === 'bn' ? 'অর্ডারসমূহ' : 'Orders', icon: ShoppingBag, badge: orders.length },
              { id: 'products', target: 'products', label: language === 'bn' ? 'পণ্যসমূহ' : 'Products', icon: Package, badge: products.length },
              { id: 'content', target: 'coupons', label: language === 'bn' ? 'কন্টেন্ট' : 'Content', icon: HeartHandshake, badge: coupons.length + reviews.length + islamicQuotes.length, activeTabs: ['coupons', 'reviews', 'quotes'] },
              { id: 'settings', target: 'hero', label: language === 'bn' ? 'সেটিংস' : 'Settings', icon: Settings, activeTabs: ['hero', 'settings', 'supabase'] }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = item.activeTabs 
                ? item.activeTabs.includes(activeTab)
                : activeTab === item.target;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.target as any)}
                  className="relative flex flex-col items-center justify-center flex-1 h-full py-1 px-1 transition-all group cursor-pointer"
                >
                  {/* Line Indicator Above Icon */}
                  {isActive && (
                    <motion.div
                      layoutId="adminNavLine"
                      className="absolute top-1 w-3.5 h-[3px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  <div className="relative flex flex-col items-center justify-center space-y-1 mt-1">
                    {/* Icon Container */}
                    <div className="relative">
                      <Icon 
                        className={`w-5 h-5 text-white transition-all duration-300 ${
                          isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'opacity-90 group-hover:opacity-100'
                        }`} 
                      />
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-white text-orange-600 text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-orange-600 z-20 shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <span className={`text-[9px] font-bold uppercase transition-all duration-300 ${
                      isActive ? 'opacity-100 translate-y-0 text-white font-extrabold' : 'opacity-80 group-hover:opacity-100'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
