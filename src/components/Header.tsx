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
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-white/90 backdrop-blur-md border-gray-200 text-gray-900 shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

            {/* Logo Brand */}
          <div
            onClick={() => onScrollToSection('hero')}
            className="flex items-center gap-3 cursor-pointer shrink-0"
            title={language === 'en' ? 'Mifta Attar House' : 'মিফতা আতর হাউস'}
          >
            <img src="/logo.png" alt="Mifta Attar House" className="h-14 w-auto object-contain" />
            <div className="flex flex-col justify-center">
              <span className="font-serif text-xl font-bold tracking-tight text-orange-600 leading-none">
                {language === 'en' ? 'MIFTA' : 'মিফতা'}
              </span>
              <span className="text-[10px] font-sans tracking-[0.2em] text-gray-800 font-bold uppercase mt-1 leading-none">
                {language === 'en' ? 'Attar House' : 'আতর হাউস'}
              </span>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-700">
            <button
              onClick={() => onScrollToSection('catalog')}
              className="hover:text-orange-500 transition-colors py-2 cursor-pointer font-sans"
            >
              {language === 'en' ? 'Oud Collection' : 'আতর কালেকশন'}
            </button>
            <button
              onClick={() => onScrollToSection('catalog')}
              className="hover:text-orange-500 transition-colors py-2 cursor-pointer font-sans"
            >
              {language === 'en' ? 'Arabic Attar' : 'অ্যারাবিক আতর'}
            </button>
            <button
              onClick={() => onScrollToSection('catalog')}
              className="hover:text-orange-500 transition-colors py-2 cursor-pointer font-sans"
            >
              {language === 'en' ? 'Gift Boxes' : 'উপহার বক্স'}
            </button>
            <button
              onClick={() => onScrollToSection('story')}
              className="hover:text-orange-500 transition-colors py-2 cursor-pointer font-sans"
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
                className="w-full h-10 pl-10 pr-4 rounded-md bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-sans"
              />
              <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-gray-400 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Smart Search Results Dropdown */}
            {showSearchResults && filteredProducts.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 max-h-[380px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-xl p-2 z-50">
                <div className="px-3 py-2 text-xs font-sans font-bold text-gray-500 uppercase border-b border-gray-100 mb-1">
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
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors border border-transparent"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name[language]}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate font-sans">
                        {product.name[language]}
                      </div>
                      <div className="text-xs text-orange-600 font-bold mt-0.5">
                        ৳{product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 hover:border-orange-500 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all font-sans cursor-pointer"
              title={language === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}
            >
              <Globe className="w-4 h-4 text-orange-500" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="hidden md:flex p-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-all relative cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Panel */}
            <button
              onClick={onOpenAccount}
              className="hidden md:flex p-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-all cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping Cart Drawer */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold leading-none font-sans">{totalCartItems}</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-4 shadow-md">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'en' ? 'Search fragrances...' : 'আতর খুঁজুন...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-md bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <div className="absolute left-0 right-0 mt-2 max-h-[250px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-xl p-2 z-50">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      setMobileMenuOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md"
                  >
                    <img src={product.images[0]} alt={product.name[language]} className="w-8 h-8 object-cover rounded border border-gray-200" />
                    <div className="text-sm font-semibold text-gray-900">{product.name[language]}</div>
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
              className="text-left text-gray-700 hover:text-orange-500 py-1 font-bold"
            >
              {language === 'en' ? 'Attar Collection' : 'আতর কালেকশন'}
            </button>
            <button
              onClick={() => {
                onScrollToSection('catalog');
                setMobileMenuOpen(false);
              }}
              className="text-left text-gray-700 hover:text-orange-500 py-1 font-bold"
            >
              {language === 'en' ? 'Natural Health' : 'ন্যাচারাল হেলথ'}
            </button>
            <button
              onClick={() => {
                onScrollToSection('catalog');
                setMobileMenuOpen(false);
              }}
              className="text-left text-gray-700 hover:text-orange-500 py-1 font-bold"
            >
              {language === 'en' ? 'Gift Chests' : 'উপহার বক্স'}
            </button>
            <button
              onClick={() => {
                onScrollToSection('story');
                setMobileMenuOpen(false);
              }}
              className="text-left text-gray-700 hover:text-orange-500 py-1 font-bold"
            >
              {language === 'en' ? 'Our Story' : 'আমাদের ঐতিহ্য'}
            </button>
          </div>

          <div className="h-px bg-gray-200 my-3" />

          {/* Quick Actions for Mobile */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Language Switch */}
            <button
              onClick={() => {
                setLanguage(language === 'en' ? 'bn' : 'en');
              }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-gray-200 bg-gray-50 font-bold text-gray-700 font-sans cursor-pointer hover:border-orange-500"
            >
              <Globe className="w-4 h-4 text-orange-500" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                onOpenWishlist();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-gray-200 bg-gray-50 font-bold text-gray-700 cursor-pointer hover:border-orange-500"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>{language === 'en' ? `Wishlist (${wishlist.length})` : `পছন্দের তালিকা (${wishlist.length})`}</span>
            </button>

            {/* Account */}
            <button
              onClick={() => {
                onOpenAccount();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-gray-200 bg-gray-50 font-bold text-gray-700 cursor-pointer hover:border-orange-500"
            >
              <User className="w-4 h-4 text-gray-500" />
              <span>{language === 'en' ? 'Account' : 'আমার অ্যাকাউন্ট'}</span>
            </button>

          </div>
        </div>
      )}
    </header>
  );
}
