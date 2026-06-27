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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F97316] border-t border-orange-600 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] pb-safe rounded-t-[2.5rem]">
      <div className="flex items-center justify-around h-16 px-4 relative">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 group transition-all duration-300 ${
                isActive ? 'text-white' : 'text-orange-100/60'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-8 h-1.5 bg-white rounded-full shadow-[0_2px_10px_rgba(255,255,255,0.3)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-90 opacity-80'}`} />
                {item.isCart && totalCartItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-white text-orange-600 text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-orange-500 shadow-sm"
                  >
                    {totalCartItems}
                  </motion.span>
                )}
              </div>
              
              <span className={`text-[9px] font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-0.5'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
