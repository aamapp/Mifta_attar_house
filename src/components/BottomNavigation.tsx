import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Search, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

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

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    {
      id: 'home',
      label: language === 'en' ? 'HOME' : 'হোম',
      icon: <Home className="w-5 h-5" />,
      action: () => {
        onScrollToSection('hero');
      }
    },
    {
      id: 'menu',
      label: language === 'en' ? 'MENU' : 'মেনু',
      icon: <LayoutGrid className="w-5 h-5" />,
      action: () => {
        onScrollToSection('catalog');
      }
    },
    {
      id: 'cart',
      label: language === 'en' ? 'CART' : 'কার্ট',
      icon: (
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
            {totalCartItems}
          </span>
        </div>
      ),
      action: onOpenCart
    },
    {
      id: 'search',
      label: language === 'en' ? 'SEARCH' : 'সার্চ',
      icon: <Search className="w-5 h-5" />,
      action: () => {
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
      icon: <User className="w-5 h-5" />,
      action: onOpenAccount
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F97316] text-white border-t border-orange-600 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] pb-safe">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors hover:bg-orange-600 active:bg-orange-700"
          >
            {item.icon}
            <span className="text-[9px] font-medium tracking-wide uppercase">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
