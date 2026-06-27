import React, { useState } from 'react';
import { Home, LayoutGrid, ShoppingBag, Search, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

export default function BottomNavigation({
  onOpenCart,
  onOpenAccount,
  onScrollToSection
}: {
  onOpenCart: () => void;
  onOpenAccount: () => void;
  onScrollToSection: (sectionId: string) => void;
}) {
  const { language, cart } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    {
      id: 'home',
      label: language === 'en' ? 'HOME' : 'হোম',
      icon: Home,
      action: () => {
        setActiveTab('home');
        onScrollToSection('hero');
      }
    },
    {
      id: 'menu',
      label: language === 'en' ? 'MENU' : 'মেনু',
      icon: LayoutGrid,
      action: () => {
        setActiveTab('menu');
        onScrollToSection('catalog');
      }
    },
    {
      id: 'cart',
      label: language === 'en' ? 'CART' : 'কার্ট',
      icon: ShoppingBag,
      action: () => {
        setActiveTab('cart');
        onOpenCart();
      },
      isCart: true
    },
    {
      id: 'search',
      label: language === 'en' ? 'SEARCH' : 'সার্চ',
      icon: Search,
      action: () => {
        setActiveTab('search');
        onScrollToSection('catalog');
        setTimeout(() => {
          const searchInput = document.getElementById('catalog-search-input');
          if (searchInput) {
            searchInput.focus();
          }
        }, 500);
      }
    },
    {
      id: 'account',
      label: language === 'en' ? 'ACCOUNT' : 'অ্যাকাউন্ট',
      icon: User,
      action: () => {
        setActiveTab('account');
        onOpenAccount();
      }
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#F97316] text-white border-t border-orange-600 shadow-[0_-4px_20px_rgba(249,115,22,0.3)] pb-safe rounded-t-2xl">
      <div className="flex items-center justify-around h-16 px-2 relative">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="relative flex flex-col items-center justify-center w-full h-full group transition-all duration-300"
            >
              {/* Line Indicator Above Icon */}
              {isActive && (
                <motion.div
                  layoutId="navLine"
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
                  
                  {item.isCart && totalCartItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 bg-white text-orange-600 text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-orange-600 z-20 shadow-sm"
                    >
                      {totalCartItems}
                    </motion.span>
                  )}
                </div>

                {/* Label */}
                <span className={`text-[8px] font-bold tracking-[0.15em] uppercase text-white transition-all duration-300 ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-70'
                }`}>
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
