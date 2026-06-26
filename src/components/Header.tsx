/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Settings,
  Flame
} from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onSelectProduct: (product: Product) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenWishlist: () => void;
}

export default function Header({
  onOpenCart,
  onOpenAccount,
  onOpenAdmin,
  onSelectProduct,
  onScrollToSection,
  onOpenWishlist
}: HeaderProps) {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    cart,
    wishlist,
    products,
    user
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Synchronized Admin login state
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('mifta_admin_logged_in') === 'true');

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem('mifta_admin_logged_in') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filter products based on search
  const filteredProducts = searchQuery.trim() === ''
    ? []
    : products.filter(p =>
        p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.bn.includes(searchQuery) ||
        p.description.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.bn.includes(searchQuery)
      );

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md border-stone-200 text-stone-900 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-500 hover:text-gold-600 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo Brand */}
          <div
            onClick={() => onScrollToSection('hero')}
            onDoubleClick={onOpenAdmin}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            title={language === 'en' ? 'Mifta Attar House (Double click logo for admin access)' : 'মিফতা আতর হাউস (অ্যাডমিন প্যানেলের জন্য লোগোতে ডাবল ক্লিক করুন)'}
          >
            {/* Islamic Star / Geometric Symbol */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-sm border border-gold-500/30 bg-white shadow-md shadow-gold-500/5">
              <span className="text-gold-600 font-serif text-2xl font-bold">M</span>
              <div className="absolute -inset-0.5 rounded-sm border border-gold-500/15 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.2em] text-gold-600 hover:text-gold-500 transition-colors">
                MIFTA ATTAR
              </span>
              <span className="text-[9px] font-sans tracking-widest text-stone-500 -mt-1 font-bold">
                মিফতা আতর হাউস
              </span>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] uppercase tracking-[0.15em] text-stone-600 font-bold">
            <button
              onClick={() => onScrollToSection('catalog')}
              className="hover:text-gold-600 transition-colors py-2 cursor-pointer font-sans"
            >
              {language === 'en' ? 'Oud Collection' : 'আতর কালেকশন'}
            </button>
            <button
              onClick={() => onScrollToSection('catalog')}
              className="hover:text-gold-600 transition-colors py-2 cursor-pointer font-sans"
            >
              {language === 'en' ? 'Arabic Attar' : 'অর্গানিক ফুড'}
            </button>
            <button
              onClick={() => onScrollToSection('catalog')}
              className="hover:text-gold-600 transition-colors py-2 cursor-pointer font-sans"
            >
              {language === 'en' ? 'Gift Boxes' : 'উপহার বক্স'}
            </button>
            <button
              onClick={() => onScrollToSection('story')}
              className="hover:text-gold-600 transition-colors py-2 cursor-pointer font-sans"
            >
              {language === 'en' ? 'Our Story' : 'আমাদের গল্প'}
            </button>
          </nav>

          {/* Search Box - Desktop */}
          <div ref={searchContainerRef} className="relative hidden md:block max-w-xs xl:max-w-md w-full">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={language === 'en' ? 'Search luxurious fragrances...' : 'পছন্দের আতর খুঁজুন...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full h-10 pl-10 pr-4 rounded-sm bg-stone-50 border border-stone-200 text-sm text-stone-850 placeholder-stone-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all font-sans"
              />
              <Search className="absolute left-3.5 w-4 h-4 text-stone-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-stone-400 hover:text-stone-900"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Smart Search Results Dropdown */}
            {showSearchResults && filteredProducts.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 max-h-[380px] overflow-y-auto rounded-sm border border-gold-500/20 bg-white shadow-2xl p-2 z-50">
                <div className="px-3 py-1 text-[11px] font-sans font-bold text-gold-600 tracking-[0.15em] uppercase border-b border-stone-150 mb-1">
                  {language === 'en' ? 'MATCHING FRAGRANCES' : 'মিলে যাওয়া পণ্যসমূহ'}
                </div>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-sm cursor-pointer transition-colors border border-transparent hover:border-gold-500/10"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name[language]}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-sm border border-stone-250"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-stone-800 truncate font-sans">
                        {product.name[language]}
                      </div>
                      <div className="text-[11px] text-gold-600 font-mono mt-0.5 font-bold">
                        ৳{product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-stone-200 hover:border-gold-500/30 text-xs font-bold text-gold-600 bg-stone-50 hover:bg-stone-100 transition-all font-sans cursor-pointer"
              title={language === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}
            >
              <Globe className="w-3.5 h-3.5 text-gold-600 animate-spin-slow" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Dark/Light Switch */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-stone-500 hover:text-gold-600 hover:bg-stone-100 rounded-sm transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-gold-550" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Admin Dashboard (Visible only when logged in as admin) */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="p-2 text-stone-500 hover:text-gold-600 hover:bg-stone-100 rounded-sm transition-all relative cursor-pointer"
                title={language === 'en' ? 'Admin Panel' : 'অ্যাডমিন প্যানেল'}
              >
                <Settings className="w-4.5 h-4.5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-gold-600" />
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-stone-500 hover:text-gold-600 hover:bg-stone-100 rounded-sm transition-all relative cursor-pointer"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Panel */}
            <button
              onClick={onOpenAccount}
              className="p-2 text-stone-500 hover:text-gold-600 hover:bg-stone-100 rounded-sm transition-all cursor-pointer"
            >
              <User className="w-4.5 h-4.5" />
            </button>

            {/* Shopping Cart Drawer */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-gold-500 text-black font-bold hover:brightness-110 transition-all shadow-md shadow-gold-500/10 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold leading-none font-sans">{totalCartItems}</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 p-4 space-y-4 shadow-md">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'en' ? 'Search fragrances...' : 'আতর খুঁজুন...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-sm bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-gold-500"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            {searchQuery && (
              <div className="absolute left-0 right-0 mt-2 max-h-[250px] overflow-y-auto rounded-sm border border-gold-500/20 bg-white shadow-2xl p-2 z-50">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      setMobileMenuOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-stone-100 rounded-sm"
                  >
                    <img src={product.images[0]} alt={product.name[language]} className="w-8 h-8 object-cover rounded-sm border border-stone-200" />
                    <div className="text-xs font-semibold text-stone-800">{product.name[language]}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 font-medium text-sm">
            <button
              onClick={() => {
                onScrollToSection('catalog');
                setMobileMenuOpen(false);
              }}
              className="text-left text-stone-600 hover:text-gold-600 py-1 font-bold"
            >
              {language === 'en' ? 'Attar Collection' : 'আতর কালেকশন'}
            </button>
            <button
              onClick={() => {
                onScrollToSection('catalog');
                setMobileMenuOpen(false);
              }}
              className="text-left text-stone-600 hover:text-gold-600 py-1 font-bold"
            >
              {language === 'en' ? 'Natural Health' : 'অর্গানিক ফুড'}
            </button>
            <button
              onClick={() => {
                onScrollToSection('catalog');
                setMobileMenuOpen(false);
              }}
              className="text-left text-stone-600 hover:text-gold-600 py-1 font-bold"
            >
              {language === 'en' ? 'Gift Chests' : 'উপহার বক্স'}
            </button>
            <button
              onClick={() => {
                onScrollToSection('story');
                setMobileMenuOpen(false);
              }}
              className="text-left text-stone-600 hover:text-gold-600 py-1 font-bold"
            >
              {language === 'en' ? 'Our Story' : 'আমাদের ঐতিহ্য'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
