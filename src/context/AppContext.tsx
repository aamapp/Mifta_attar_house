/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Theme, Product, Category, CartItem, Coupon, UserProfile, Order, Review } from '../types';
import { PRODUCTS, CATEGORIES, INITIAL_COUPONS } from '../data';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: { en: string; bn: string } };
  removeCoupon: () => void;
  user: UserProfile | null;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  orders: Order[];
  placeOrder: (shippingDetails: {
    name: string;
    phone: string;
    address: string;
    district: string;
    division: string;
    deliveryOption: string;
    paymentOption: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  deleteOrder: (orderId: string) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  deleteReview: (reviewId: string) => void;
  
  // Toast Notifications
  toasts: { id: string; message: { en: string; bn: string }; type: 'success' | 'error' | 'info' }[];
  addToast: (msg: { en: string; bn: string }, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Dynamic Website Custom Contents
  websiteSettings: {
    heroTitleEn: string;
    heroTitleBn: string;
    heroDescEn: string;
    heroDescBn: string;
    promoTextEn: string;
    promoTextBn: string;
    announcementEn: string;
    announcementBn: string;
  };
  updateWebsiteSettings: (settings: Partial<{
    heroTitleEn: string;
    heroTitleBn: string;
    heroDescEn: string;
    heroDescBn: string;
    promoTextEn: string;
    promoTextBn: string;
    announcementEn: string;
    announcementBn: string;
  }>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Lang & Theme
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('mifta_lang') as Language) || 'bn';
  });
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('mifta_theme') as Theme) || 'dark';
  });

  // Website custom content state
  const [websiteSettings, setWebsiteSettings] = useState(() => {
    const local = localStorage.getItem('mifta_website_settings');
    if (local) return JSON.parse(local);
    return {
      heroTitleEn: 'The Essence of Pure Devotion.',
      heroTitleBn: 'প্রতিটি ফোঁটায় শতভাগ পবিত্রতা ও আভিজাত্য',
      heroDescEn: 'Discover the Mifta Attar House collection. Handcrafted premium fragrances, 100% alcohol-free, inspired by the rich heritage of Arabian luxury and purity.',
      heroDescBn: 'প্রাকৃতিক ও রাজকীয় উপাদান থেকে পাতিত দীর্ঘস্থায়ী সুগন্ধি ও আতর। আপনার সালাত, ইবাদত এবং আভিজাত্যপূর্ণ জীবনযাত্রাকে সুরভিত করতে মিফতা আতরের বিকল্প নেই।',
      promoTextEn: 'Premium Sunnah Attar & Islamic Gift Collections',
      promoTextBn: 'ইসলামী ঐতিহ্যের ছোঁয়ায় তৈরি প্রিমিয়াম আতর, সুগন্ধি, সুন্নাহ গিফট এবং অর্গানিক স্বাস্থ্যের সেরা পণ্য বেছে নিন।',
      announcementEn: '🕌 SPECIAL OFFER: Get 10% OFF using coupon SUNNAH10! FREE SHIPPING inside Dhaka for orders over ৳1500!',
      announcementBn: '🕌 বিশেষ অফার: কুপন SUNNAH10 ব্যবহারে ১০% ছাড়! ১৫০০ টাকার বেশি অর্ডারে ঢাকা সিটিতে ফ্রি ডেলিভারি!'
    };
  });

  const updateWebsiteSettings = (newSettings: any) => {
    setWebsiteSettings((prev: any) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('mifta_website_settings', JSON.stringify(updated));
      return updated;
    });
    addToast(
      { en: 'Website content updated successfully!', bn: 'ওয়েবসাইটের তথ্য সফলভাবে আপডেট করা হয়েছে!' },
      'success'
    );
  };

  // State
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('mifta_products');
    return local ? JSON.parse(local) : PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('mifta_cart');
    return local ? JSON.parse(local) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const local = localStorage.getItem('mifta_wishlist');
    return local ? JSON.parse(local) : [];
  });
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const local = localStorage.getItem('mifta_recently_viewed');
    return local ? JSON.parse(local) : [];
  });
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const local = localStorage.getItem('mifta_coupons');
    return local ? JSON.parse(local) : INITIAL_COUPONS;
  });
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(() => {
    const local = localStorage.getItem('mifta_active_coupon');
    return local ? JSON.parse(local) : null;
  });
  const [user, setUser] = useState<UserProfile | null>(() => {
    const local = localStorage.getItem('mifta_user');
    return local ? JSON.parse(local) : {
      uid: 'mifta-guest-user',
      name: 'Mamun Chowdhury',
      email: 'mamun15yr@gmail.com',
      phone: '01712345678',
      address: 'House 42, Road 11, Banani',
      district: 'Dhaka',
      division: 'Dhaka',
      wishlist: [],
      recentlyViewed: []
    };
  });
  
  // Seed sample initial orders so Dashboard is beautifully populated
  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('mifta_orders');
    if (local) return JSON.parse(local);
    
    const initialOrders: Order[] = [
      {
        id: 'MFT-87293',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        customerName: 'Sajid Al Hasan',
        phone: '01811223344',
        address: 'Sector 4, Uttara',
        district: 'Dhaka',
        division: 'Dhaka',
        items: [
          { productId: 'white-oud', name: 'White Oud Premium Attar (6ml)', price: 450, quantity: 1, size: '6ml' },
          { productId: 'cool-water', name: 'Cool Water Oceanic Attar (3ml)', price: 290, quantity: 2, size: '3ml' }
        ],
        subtotal: 1030,
        discount: 103, // SUNNAH10 applied
        shipping: 60,
        total: 987,
        couponCode: 'SUNNAH10',
        paymentMethod: 'bkash',
        paymentStatus: 'paid',
        orderStatus: 'shipped',
        trackingNumber: 'TRK-WHITE-987A'
      },
      {
        id: 'MFT-12495',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        customerName: 'Kamrul Islam',
        phone: '01998877665',
        address: 'Halisahar',
        district: 'Chattogram',
        division: 'Chattogram',
        items: [
          { productId: 'luxury-gift-box', name: 'Mifta Royal Sunnah Gift Box', price: 1500, quantity: 1 }
        ],
        subtotal: 1500,
        discount: 225, // FREEODOR applied
        shipping: 120,
        total: 1395,
        couponCode: 'FREEODOR',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'pending'
      }
    ];
    return initialOrders;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const local = localStorage.getItem('mifta_reviews');
    if (local) return JSON.parse(local);
    
    return [
      {
        id: 'rev-1',
        productId: 'white-oud',
        userName: 'Sajid Al Hasan',
        rating: 5,
        comment: 'হোয়াইট উদের সুবাস এক কথায় অসাধারণ! ২৪ ঘণ্টারও বেশি সময় জামায় সুঘ্রাণ লেগে ছিল। বিশেষ করে সুতি পাঞ্জাবিতে অনেক ভালো ছড়ায়।',
        date: '2026-06-24',
        verified: true
      },
      {
        id: 'rev-2',
        productId: 'white-oud',
        userName: 'Muinul Islam',
        rating: 5,
        comment: 'Highly recommended! Original Arabic raw feel. Extremely pleasant and soothing during prayers.',
        date: '2026-06-25',
        verified: true
      },
      {
        id: 'rev-3',
        productId: 'cool-water',
        userName: 'Rakibul Islam',
        rating: 5,
        comment: 'এই গরমে কুল ওয়াটার সত্যিই প্রাণ জুড়ানো সুবাস দেয়। সালাত শেষ করার পরেও সুবাস পাওয়া যায়।',
        date: '2026-06-22',
        verified: true
      },
      {
        id: 'rev-4',
        productId: 'prophetic-honey',
        userName: 'Abdur Rahman',
        rating: 5,
        comment: 'শতভাগ খাঁটি সরিষা ফুলের মধু। ঘনত্ব এবং সুবাস সত্যিই প্রমাণ করে যে এটি অর্গানিক ও ফ্রেশ। কালোজিরার সাথে অসাধারণ কাজ করে।',
        date: '2026-06-20',
        verified: true
      }
    ];
  });

  // Toasts
  const [toasts, setToasts] = useState<{ id: string; message: { en: string; bn: string }; type: 'success' | 'error' | 'info' }[]>([]);

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem('mifta_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mifta_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mifta_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('mifta_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('mifta_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('mifta_active_coupon', JSON.stringify(activeCoupon));
  }, [activeCoupon]);

  useEffect(() => {
    localStorage.setItem('mifta_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mifta_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mifta_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Set Language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mifta_lang', lang);
    addToast(
      { en: `Language switched to English`, bn: `ভাষা পরিবর্তন করে বাংলা করা হয়েছে` },
      'info'
    );
  };

  // Set Theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('mifta_theme', newTheme);
    
    // Add/remove class to HTML for Tailwind theming if needed
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    addToast(
      { en: `Theme switched to ${newTheme} mode`, bn: `${newTheme === 'dark' ? 'ডার্ক' : 'লাইট'} মোড সক্রিয় করা হয়েছে` },
      'info'
    );
  };

  // Apply default dark/light class on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Toast controls
  const addToast = (msg: { en: string; bn: string }, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message: msg, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, size = '6ml') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedSize: size }];
      }
    });

    addToast(
      {
        en: `Added ${product.name.en} (${size}) to your bag!`,
        bn: `ব্যাগ-এ যুক্ত করা হয়েছে: ${product.name.bn} (${size})`
      },
      'success'
    );
  };

  const removeFromCart = (productId: string, size?: string) => {
    const targetProduct = products.find(p => p.id === productId);
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && (!size || item.selectedSize === size)))
    );
    addToast(
      {
        en: `Removed ${targetProduct?.name.en || 'product'} from your bag.`,
        bn: `ব্যাগ থেকে বাদ দেওয়া হয়েছে: ${targetProduct?.name.bn || 'পণ্য'}`
      },
      'info'
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && (!size || item.selectedSize === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  // Wishlist toggle
  const toggleWishlist = (productId: string) => {
    const targetProduct = products.find(p => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast(
          { en: `Removed from wishlist: ${targetProduct?.name.en}`, bn: `উইশলিস্ট থেকে সরানো হয়েছে: ${targetProduct?.name.bn}` },
          'info'
        );
        return prev.filter((id) => id !== productId);
      } else {
        addToast(
          { en: `Saved to wishlist: ${targetProduct?.name.en}`, bn: `উইশলিস্টে সংরক্ষণ করা হয়েছে: ${targetProduct?.name.bn}` },
          'success'
        );
        return [...prev, productId];
      }
    });
  };

  // Recently viewed
  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 6); // Max 6 items
    });
  };

  // Apply Coupon
  const applyCoupon = (code: string) => {
    const codeUpper = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === codeUpper && c.isActive);
    
    if (!coupon) {
      return {
        success: false,
        message: { en: 'Invalid or expired coupon code.', bn: 'কুপন কোডটি সঠিক নয় অথবা মেয়াদোত্তীর্ণ।' }
      };
    }

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: {
          en: `Minimum purchase value of ৳${coupon.minOrderValue} required for this coupon.`,
          bn: `এই কুপন ব্যবহারের জন্য সর্বনিম্ন ৳${coupon.minOrderValue} কেনাকাটা প্রয়োজন।`
        }
      };
    }

    setActiveCoupon(coupon);
    addToast(
      {
        en: `Coupon "${codeUpper}" applied successfully!`,
        bn: `কুপন "${codeUpper}" সফলভাবে প্রযোগ করা হয়েছে!`
      },
      'success'
    );
    return {
      success: true,
      message: { en: 'Coupon applied successfully.', bn: 'কুপনটি সফলভাবে প্রয়োগ করা হয়েছে।' }
    };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    addToast(
      { en: 'Coupon code removed.', bn: 'কুপন কোডটি বাতিল করা হয়েছে।' },
      'info'
    );
  };

  // User Actions
  const loginUser = (email: string, name = 'Customer') => {
    const newUser: UserProfile = {
      uid: 'user-' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      wishlist: [],
      recentlyViewed: []
    };
    setUser(newUser);
    addToast(
      { en: `Welcome back, ${name}!`, bn: `আবারো স্বাগতম, ${name}!` },
      'success'
    );
  };

  const logoutUser = () => {
    setUser(null);
    setActiveCoupon(null);
    addToast(
      { en: 'Logged out successfully.', bn: 'সফলভাবে লগআউট করা হয়েছে।' },
      'info'
    );
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...profile } : null));
    addToast(
      { en: 'Profile updated successfully.', bn: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে।' },
      'success'
    );
  };

  // Orders Management
  const placeOrder = (shippingDetails: {
    name: string;
    phone: string;
    address: string;
    district: string;
    division: string;
    deliveryOption: string;
    paymentOption: string;
  }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    // Calculate coupon discount
    let discount = 0;
    if (activeCoupon) {
      if (activeCoupon.discountType === 'percentage') {
        discount = Math.round((subtotal * activeCoupon.discountValue) / 100);
      } else {
        discount = activeCoupon.discountValue;
      }
    }

    // Shipping cost
    const shipping = shippingDetails.deliveryOption === 'dhaka' ? 60 : 120;
    const total = subtotal - discount + shipping;

    const newOrder: Order = {
      id: 'MFT-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString(),
      customerName: shippingDetails.name,
      phone: shippingDetails.phone,
      address: shippingDetails.address,
      district: shippingDetails.district,
      division: shippingDetails.division,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name[language],
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize
      })),
      subtotal,
      discount,
      shipping,
      total,
      couponCode: activeCoupon?.code,
      paymentMethod: shippingDetails.paymentOption as Order['paymentMethod'],
      paymentStatus: shippingDetails.paymentOption === 'cod' ? 'pending' : 'paid',
      orderStatus: 'pending'
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    
    addToast(
      {
        en: `Alhamdulillah! Order ${newOrder.id} placed successfully.`,
        bn: `আলহামদুলিল্লাহ! আপনার অর্ডার ${newOrder.id} সফলভাবে সম্পন্ন হয়েছে।`
      },
      'success'
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              orderStatus: status,
              paymentStatus: status === 'delivered' ? 'paid' : ord.paymentStatus,
              trackingNumber: status === 'shipped' && !ord.trackingNumber ? 'TRK-' + Math.random().toString(36).substring(2, 8).toUpperCase() : ord.trackingNumber
            }
          : ord
      )
    );
    addToast(
      {
        en: `Order ${orderId} status updated to: ${status}`,
        bn: `অর্ডার ${orderId}-এর অবস্থা পরিবর্তিত হয়েছে: ${status}`
      },
      'success'
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    addToast(
      { en: `Order ${orderId} has been deleted.`, bn: `অর্ডার ${orderId} মুছে ফেলা হয়েছে।` },
      'info'
    );
  };

  // Reviews
  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newReview, ...prev]);
    addToast(
      {
        en: 'Jazakallah Khair for your beautiful review! Moderation complete.',
        bn: 'আপনার সুন্দর পর্যালোচনার জন্য জাজাকাল্লাহ খাইরান!'
      },
      'success'
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((rev) => rev.id !== reviewId));
    addToast(
      { en: 'Review deleted.', bn: 'পর্যালোচনা মুছে ফেলা হয়েছে।' },
      'info'
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        products,
        setProducts,
        categories: CATEGORIES,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        recentlyViewed,
        addRecentlyViewed,
        coupons,
        setCoupons,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        user,
        loginUser,
        logoutUser,
        updateProfile,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        reviews,
        addReview,
        deleteReview,
        toasts,
        addToast,
        removeToast,
        websiteSettings,
        updateWebsiteSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
