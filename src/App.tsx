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
import BottomNavigation from './components/BottomNavigation';
import SmartSelect from './components/SmartSelect';
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

  // Lock body scroll when any modal is open
  React.useEffect(() => {
    const isAnyModalOpen = cartOpen || accountOpen || adminOpen || checkoutOpen || !!quickViewProduct;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [cartOpen, accountOpen, adminOpen, checkoutOpen, quickViewProduct]);

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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-orange-500 selection:text-white antialiased overflow-x-hidden relative pb-14 md:pb-0 pt-16">
      
      {/* 1. Header Layout */}
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        onScrollToSection={(sectionId) => {
          setCartOpen(false);
          setAccountOpen(false);
          if (sectionId === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const el = document.getElementById(sectionId);
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenWishlist={() => {
          setCartOpen(false);
          setAccountOpen(true);
        }}
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

      {/* 4. Main Store Catalog & Interactive Filtering Controls Section */}
      <main id="catalog" className="py-12 bg-white relative">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Title Headers */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {language === 'en' ? 'Explore Products' : 'আমাদের কালেকশন'}
            </h2>
          </div>

          {/* Filtering Widgets Row Panel */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 shadow-sm mb-8 flex flex-col gap-4">
            
            {/* Row 1: Search bar, Sort bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Search input widget */}
              <div className="md:col-span-6 relative">
                <input
                  id="catalog-search-input"
                  type="text"
                  placeholder={language === 'en' ? 'Search for royal Oud, Rose, Kalojira...' : 'পছন্দের পণ্য সার্চ করুন...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-lg bg-white border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-orange-500 transition-all font-sans"
                />
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              </div>

              <div className="md:col-span-3">
                <SmartSelect
                  label={language === 'en' ? 'Sort By' : 'সর্টিং'}
                  value={sortBy}
                  onChange={(val) => setSortBy(val as any)}
                  options={[
                    { value: 'default', label: language === 'en' ? 'Default Sorting' : 'সাধারণ সর্টিং' },
                    { value: 'price-low', label: language === 'en' ? 'Price: Low to High' : 'মূল্য: কম থেকে বেশি' },
                    { value: 'price-high', label: language === 'en' ? 'Price: High to Low' : 'মূল্য: বেশি থেকে কম' },
                    { value: 'rating', label: language === 'en' ? 'Customer Rating' : 'গ্রাহক রেটিং অনুসারে' },
                  ]}
                />
              </div>

              {/* Reset Category Quick trigger */}
              <div className="md:col-span-3 flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none whitespace-nowrap">
                {[
                  { id: 'all', en: 'All', bn: 'সব' },
                  { id: 'oud', en: 'Oud', bn: 'উদ' },
                  { id: 'arabic', en: 'Arabic', bn: 'অ্যারাবিক' },
                  { id: 'floral', en: 'Floral', bn: 'ফ্লোরাল' },
                  { id: 'natural', en: 'Natural', bn: 'ন্যাচারাল' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-1 min-w-[64px] md:min-w-0 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-600 hover:text-orange-500 hover:border-orange-200'
                    }`}
                  >
                    {language === 'en' ? cat.en : cat.bn}
                  </button>
                ))}
              </div>

            </div>

            {/* Row 2: Price range filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 text-xs">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <span className="font-bold uppercase tracking-wider text-gray-500">
                  {language === 'en' ? 'FILTERS BUDGET RANGE:' : 'বাজেট সীমা:'}
                </span>
                <span className="font-mono text-orange-500 font-bold">৳0 — ৳{priceRange}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full sm:max-w-xs h-1 rounded-sm bg-gray-200 accent-orange-500 cursor-pointer"
              />
            </div>

          </div>

          {/* Grid list of Product Card modules */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200 bg-gray-50 space-y-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-sm font-bold text-gray-800">
                  {language === 'en' ? 'No items match your filters' : 'কোনো পণ্য পাওয়া যায়নি'}
                </h3>
                <p className="text-xs text-gray-500 font-sans">
                  {language === 'en' ? 'Try adjusting your search queries or slider values.' : 'অনুগ্রহ করে বাজেট বা সর্টিং পরিবর্তন করে চেষ্টা করুন।'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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

      <IslamicQuoteSection />

      {/* 7. Footer segment */}
      <Footer onAdminToggle={() => setAdminOpen(true)} />

      {/* 8. Floating Back to Top / Advisor Chat module */}
      <FloatingButtons />

      {/* 9. Mobile Bottom Navigation */}
      {!adminOpen && !cartOpen && !accountOpen && !quickViewProduct && !checkoutOpen && (
        <BottomNavigation
          onOpenCart={() => {
            setAccountOpen(false);
            setCartOpen(true);
          }}
          onOpenAccount={() => {
            setCartOpen(false);
            setAccountOpen(true);
          }}
          onScrollToSection={(sectionId) => {
            setCartOpen(false);
            setAccountOpen(false);
            if (sectionId === 'hero') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              const el = document.getElementById(sectionId);
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      )}

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
      <Toast />

    </div>
  );
}
