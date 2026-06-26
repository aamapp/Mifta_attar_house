/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Product } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedCategories from './components/FeaturedCategories';
import IslamicQuoteSection from './components/IslamicQuoteSection';
import ProductCard from './components/ProductCard';
import ProductQuickView from './components/ProductQuickView';
import SideCart from './components/SideCart';
import CheckoutModal from './components/CheckoutModal';
import AccountModal from './components/AccountModal';
import AdminPanel from './components/AdminPanel';
import FloatingButtons from './components/FloatingButtons';
import BrandStory from './components/BrandStory';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { Search, SlidersHorizontal, ArrowUpDown, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function App() {
  const {
    products,
    language,
    toasts,
    removeToast
  } = useApp();

  // Active Modals state toggles
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Instant direct buy product reference
  const [directCheckoutProduct, setDirectCheckoutProduct] = useState<{
    product: Product;
    quantity: number;
    size: string;
  } | undefined>(undefined);

  // Catalog Filtration and Sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

  // Hidden admin triggers: URL Hash change and Keyboard shortcut
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true);
        // Clear hash to hide the trace
        window.history.replaceState(null, '', ' ');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Alt + A
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);

    // Initial check on load
    if (window.location.hash === '#admin') {
      handleHashChange();
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Triggering instant Buy Now button from cards or details
  const handleBuyNow = (product: Product, quantity = 1, size = '6ml') => {
    setDirectCheckoutProduct({ product, quantity, size });
    setCheckoutOpen(true);
  };

  const handleCheckoutClose = () => {
    setCheckoutOpen(false);
    setDirectCheckoutProduct(undefined); // Clear direct buy reference
  };

  // Filtration logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price <= priceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 font-sans selection:bg-gold-500 selection:text-black antialiased overflow-x-hidden relative islamic-pattern">
      
      {/* 1. Header Layout */}
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        onScrollToSection={(sectionId) => {
          if (sectionId === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const el = document.getElementById(sectionId);
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenWishlist={() => setAccountOpen(true)}
      />

      {/* 2. Premium Hero Banner */}
      <Hero
        onExplore={() => {
          const catalogEl = document.getElementById('catalog');
          catalogEl?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFlashSale={() => {
          setSearchQuery('flash');
          const catalogEl = document.getElementById('catalog');
          catalogEl?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Featured Categories Slider */}
      <FeaturedCategories onSelectCategory={(catId) => {
        setSelectedCategory(catId);
        const catalogEl = document.getElementById('catalog');
        catalogEl?.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* 4. Islamic Prophetic rotating clean quote */}
      <IslamicQuoteSection />

      {/* 5. Main Store Catalog & Interactive Filtering Controls Section */}
      <main id="catalog" className="py-20 bg-[#FAF8F5] relative border-t border-gold-500/15">
        
        {/* Abstract golden radial background decor */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Title Headers */}
          <div className="text-center space-y-3 mb-12">
            <span className="block text-xs font-bold tracking-[0.2em] text-gold-600 uppercase font-sans">
              {language === 'en' ? 'PUREST ESSENCE CATALOG' : 'আভিজাত্য ও পবিত্রতার অনন্য কালেকশন'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900">
              {language === 'en' ? 'EXPLORE OUR FRAGRANCES' : 'আমাদের সম্পূর্ণ ক্যাটালগ'}
            </h2>
            <div className="h-0.5 w-16 bg-gold-500 mx-auto" />
          </div>

          {/* Filtering Widgets Row Panel */}
          <div className="p-5 rounded-sm border border-stone-200 bg-white shadow-sm mb-10 flex flex-col gap-4">
            
            {/* Row 1: Search bar, Sort bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Search input widget */}
              <div className="md:col-span-6 relative">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search for royal Oud, Rose, Kalojira...' : 'পছন্দের সুগন্ধি সার্চ করুন...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-sm bg-stone-50 border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-sans"
                />
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
              </div>

              {/* Sort selector widget */}
              <div className="md:col-span-3 relative">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-sm bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-gold-500 uppercase cursor-pointer"
                >
                  <option value="default">{language === 'en' ? 'Default Sorting' : 'সাধারণ সর্টিং'}</option>
                  <option value="price-low">{language === 'en' ? 'Price: Low to High' : 'মূল্য: কম থেকে বেশি'}</option>
                  <option value="price-high">{language === 'en' ? 'Price: High to Low' : 'মূল্য: বেশি থেকে কম'}</option>
                  <option value="rating">{language === 'en' ? 'Customer Rating' : 'গ্রাহক রেটিং অনুসারে'}</option>
                </select>
                <ArrowUpDown className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>

              {/* Reset Category Quick trigger */}
              <div className="md:col-span-3 flex gap-2">
                {['all', 'oud', 'arabic', 'floral', 'natural'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-1 py-2.5 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-gold-500 text-black font-extrabold shadow-sm'
                        : 'border border-stone-200 text-stone-600 hover:text-black hover:bg-stone-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Row 2: Price range filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-stone-200 text-xs">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold-600" />
                <span className="font-bold uppercase tracking-wider text-stone-500">
                  {language === 'en' ? 'FILTERS BUDGET RANGE:' : 'বাজেট সীমা:'}
                </span>
                <span className="font-mono text-gold-600 font-bold">৳0 — ৳{priceRange}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full sm:max-w-xs h-1 rounded-sm bg-stone-200 accent-gold-500 cursor-pointer"
              />
            </div>

          </div>

          {/* Grid list of Product Card modules */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-stone-300 bg-white space-y-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-500 animate-pulse">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-sm font-bold text-stone-800">
                  {language === 'en' ? 'No items match your filters' : 'কোনো পণ্য পাওয়া যায়নি'}
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  {language === 'en' ? 'Try adjusting your search queries or slider values.' : 'অনুগ্রহ করে বাজেট বা সর্টিং পরিবর্তন করে চেষ্টা করুন।'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onBuyNow={(p) => handleBuyNow(p)}
                />
              ))}
            </div>
          )}

        </div>
      </main>

      {/* 6. Legacy Narrative / Why Choose Us segment */}
      <BrandStory />

      {/* 7. Footer segment */}
      <Footer onAdminToggle={() => setAdminOpen(true)} />

      {/* 8. Floating Back to Top / Advisor Chat module */}
      <FloatingButtons />

      {/* =========================================
          MODALS CHANNELS & DRAWER MANAGERS
          ========================================= */}

      {/* Side Cart Slide Drawer */}
      <SideCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Product Details / Quick View Modal popup */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onBuyNow={(p, qty, size) => {
            setQuickViewProduct(null);
            handleBuyNow(p, qty, size);
          }}
        />
      )}

      {/* Checkout step-by-step modal drawer */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={handleCheckoutClose}
        directProduct={directCheckoutProduct}
      />

      {/* Account / Order status tracking panel */}
      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      {/* Administrative System Portal */}
      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

      {/* Global Toasts Alerts Overlay Stack */}
      <div className="fixed top-24 right-4 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

    </div>
  );
}
