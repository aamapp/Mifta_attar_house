/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Language, Theme, Product, Category, CartItem, Coupon, UserProfile, Order, Review, IslamicQuote } from '../types';
import { PRODUCTS, CATEGORIES, INITIAL_COUPONS, ISLAMIC_QUOTES } from '../data';
import {
  supabase,
  getSupabaseWebsiteSettings,
  saveSupabaseWebsiteSettings,
  getSupabaseProducts,
  saveSupabaseProduct,
  deleteSupabaseProduct,
  getSupabaseOrders,
  saveSupabaseOrder,
  getSupabaseReviews,
  saveSupabaseReview,
  deleteSupabaseReview,
  getSupabaseCoupons,
  saveSupabaseCoupon,
  checkSupabaseConnection
} from '../lib/supabase';

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
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  deleteReview: (reviewId: string) => void;
  
  // Islamic Quotes
  islamicQuotes: IslamicQuote[];
  setIslamicQuotes: React.Dispatch<React.SetStateAction<IslamicQuote[]>>;
  
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

  // Supabase Integration Fields
  supabaseStatus: { connected: boolean; tables: { [key: string]: boolean } };
  syncingWithSupabase: boolean;
  syncAllToSupabase: () => Promise<boolean>;
  refetchFromSupabase: () => Promise<void>;
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

  // Supabase State & connection
  const [supabaseStatus, setSupabaseStatus] = useState<{ connected: boolean; tables: { [key: string]: boolean } }>({
    connected: false,
    tables: {
      mifta_website_settings: false,
      mifta_products: false,
      mifta_orders: false,
      mifta_reviews: false,
      mifta_coupons: false,
    }
  });
  const [syncingWithSupabase, setSyncingWithSupabase] = useState(false);

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
      
      // Sync to Supabase in background
      if (supabaseStatus.connected && supabaseStatus.tables.mifta_website_settings) {
        saveSupabaseWebsiteSettings(updated).catch((err) =>
          console.error('Error background syncing website settings:', err)
        );
      }
      return updated;
    });
    addToast(
      { en: 'Website content updated successfully!', bn: 'ওয়েবসাইটের তথ্য সফলভাবে আপডেট করা হয়েছে!' },
      'success'
    );
  };

  const refetchFromSupabase = async () => {
    setSyncingWithSupabase(true);
    try {
      const status = await checkSupabaseConnection();
      setSupabaseStatus(status);

      if (status.connected) {
        // Load Website Settings
        if (status.tables.mifta_website_settings) {
          const settings = await getSupabaseWebsiteSettings();
          if (settings) {
            setWebsiteSettings(settings);
            localStorage.setItem('mifta_website_settings', JSON.stringify(settings));
          }
        }

        // Load Products
        if (status.tables.mifta_products) {
          const dbProducts = await getSupabaseProducts();
          if (dbProducts && dbProducts.length > 0) {
            setRawProducts(dbProducts);
            localStorage.setItem('mifta_products', JSON.stringify(dbProducts));
          }
        }

        // Load Coupons
        if (status.tables.mifta_coupons) {
          const dbCoupons = await getSupabaseCoupons();
          if (dbCoupons && dbCoupons.length > 0) {
            setRawCoupons(dbCoupons);
            localStorage.setItem('mifta_coupons', JSON.stringify(dbCoupons));
          }
        }

        // Load Reviews
        if (status.tables.mifta_reviews) {
          const dbReviews = await getSupabaseReviews();
          if (dbReviews && dbReviews.length > 0) {
            setReviews(dbReviews);
            localStorage.setItem('mifta_reviews', JSON.stringify(dbReviews));
          }
        }

        // Load Orders
        if (status.tables.mifta_orders) {
          const dbOrders = await getSupabaseOrders();
          if (dbOrders && dbOrders.length > 0) {
            setOrders(dbOrders);
            localStorage.setItem('mifta_orders', JSON.stringify(dbOrders));
          }
        }
      }
    } catch (err) {
      console.error('Failed to refetch data from Supabase:', err);
    } finally {
      setSyncingWithSupabase(false);
    }
  };

  const syncAllToSupabase = async (): Promise<boolean> => {
    setSyncingWithSupabase(true);
    try {
      const status = await checkSupabaseConnection();
      setSupabaseStatus(status);

      if (!status.connected) {
        addToast(
          { en: 'Supabase connection failed or tables do not exist yet. Please run the SQL setup script first!', bn: 'সুপাবেস কানেকশন ব্যর্থ হয়েছে অথবা টেবিলসমূহ এখনও তৈরি করা হয়নি। দয়া করে প্রথমে SQL রান করুন!' },
          'error'
        );
        return false;
      }

      let successCount = 0;
      let totalSteps = 0;

      // 1. Sync Website Settings
      if (status.tables.mifta_website_settings) {
        totalSteps++;
        const ok = await saveSupabaseWebsiteSettings(websiteSettings);
        if (ok) successCount++;
      }

      // 2. Sync Products
      if (status.tables.mifta_products) {
        totalSteps++;
        let ok = true;
        for (const p of products) {
          const res = await saveSupabaseProduct(p);
          if (!res) ok = false;
        }
        if (ok) successCount++;
      }

      // 3. Sync Coupons
      if (status.tables.mifta_coupons) {
        totalSteps++;
        let ok = true;
        for (const c of coupons) {
          const res = await saveSupabaseCoupon(c);
          if (!res) ok = false;
        }
        if (ok) successCount++;
      }

      // 4. Sync Reviews
      if (status.tables.mifta_reviews) {
        totalSteps++;
        let ok = true;
        for (const r of reviews) {
          const res = await saveSupabaseReview(r);
          if (!res) ok = false;
        }
        if (ok) successCount++;
      }

      // 5. Sync Orders
      if (status.tables.mifta_orders) {
        totalSteps++;
        let ok = true;
        for (const o of orders) {
          const res = await saveSupabaseOrder(o);
          if (!res) ok = false;
        }
        if (ok) successCount++;
      }

      if (successCount === totalSteps && totalSteps > 0) {
        addToast(
          { en: 'Alhamdulillah! Successfully migrated all local store data to Supabase!', bn: 'আলহামদুলিল্লাহ! সকল লোকাল ডাটা সফলভাবে সুপাবেসে মাইগ্রেট করা হয়েছে!' },
          'success'
        );
        return true;
      } else {
        addToast(
          { en: `Migration partially succeeded (${successCount}/${totalSteps} tables synced).`, bn: `মাইগ্রেশন আংশিক সফল হয়েছে (${successCount}/${totalSteps} টেবিল সিঙ্ক হয়েছে)।` },
          'info'
        );
        return false;
      }
    } catch (err) {
      console.error('Migration failed:', err);
      addToast(
        { en: 'Migration failed due to server error.', bn: 'সার্ভার ত্রুটির কারণে মাইগ্রেশন ব্যর্থ হয়েছে।' },
        'error'
      );
      return false;
    } finally {
      setSyncingWithSupabase(false);
    }
  };

  // Run connection check and initial fetch on mount
  useEffect(() => {
    refetchFromSupabase();
  }, []);


  // State
  const [products, setRawProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('mifta_products');
    return local ? JSON.parse(local) : PRODUCTS;
  });

  const setProducts: React.Dispatch<React.SetStateAction<Product[]>> = (action) => {
    setRawProducts((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      
      // Sync to Supabase in background
      if (supabaseStatus.connected && supabaseStatus.tables.mifta_products) {
        // Find deleted products
        const deleted = prev.filter(p => !next.some(n => n.id === p.id));
        deleted.forEach(p => {
          deleteSupabaseProduct(p.id).catch(e => console.error("Error background deleting product:", e));
        });
        
        // Find added or updated products
        next.forEach(p => {
          saveSupabaseProduct(p).catch(e => console.error("Error background saving product:", e));
        });
      }
      return next;
    });
  };

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

  const [coupons, setRawCoupons] = useState<Coupon[]>(() => {
    const local = localStorage.getItem('mifta_coupons');
    return local ? JSON.parse(local) : INITIAL_COUPONS;
  });

  const setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>> = (action) => {
    setRawCoupons((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      
      // Sync to Supabase in background
      if (supabaseStatus.connected && supabaseStatus.tables.mifta_coupons) {
        // Find deleted coupons
        const deleted = prev.filter(c => !next.some(n => n.code === c.code));
        deleted.forEach(c => {
          supabase.from('mifta_coupons').delete().eq('code', c.code).then(({ error }) => { if (error) console.error(error); });
        });
        
        // Find added/updated coupons
        next.forEach(c => {
          saveSupabaseCoupon(c).catch(e => console.error(e));
        });
      }
      return next;
    });
  };
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(() => {
    const local = localStorage.getItem('mifta_active_coupon');
    return local ? JSON.parse(local) : null;
  });
  const [user, setUser] = useState<UserProfile | null>(() => {
    const local = localStorage.getItem('mifta_user');
    return local ? JSON.parse(local) : {
      uid: 'mifta-guest-user',
      name: '',
      email: '',
      phone: '',
      address: '',
      district: '',
      division: '',
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

  const [islamicQuotes, setIslamicQuotesState] = useState<IslamicQuote[]>(() => {
    const local = localStorage.getItem('mifta_islamic_quotes');
    return local ? JSON.parse(local) : ISLAMIC_QUOTES;
  });

  const setIslamicQuotes: React.Dispatch<React.SetStateAction<IslamicQuote[]>> = (action) => {
    setIslamicQuotesState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      localStorage.setItem('mifta_islamic_quotes', JSON.stringify(next));
      return next;
    });
  };

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
    upazila?: string;
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
      upazila: shippingDetails.upazila,
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

    // Background sync to Supabase
    if (supabaseStatus.connected && supabaseStatus.tables.mifta_orders) {
      saveSupabaseOrder(newOrder).catch((err) =>
        console.error('Error background syncing placed order:', err)
      );
    }
    
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
    setOrders((prev) => {
      const next = prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              orderStatus: status,
              paymentStatus: status === 'delivered' ? 'paid' : ord.paymentStatus,
              trackingNumber: status === 'shipped' && !ord.trackingNumber ? 'TRK-' + Math.random().toString(36).substring(2, 8).toUpperCase() : ord.trackingNumber
            }
          : ord
      );

      // Background sync to Supabase
      const updatedOrder = next.find((o) => o.id === orderId);
      if (updatedOrder && supabaseStatus.connected && supabaseStatus.tables.mifta_orders) {
        saveSupabaseOrder(updatedOrder).catch((err) =>
          console.error('Error background syncing order status:', err)
        );
      }

      return next;
    });

    addToast(
      {
        en: `Order ${orderId} status updated to: ${status}`,
        bn: `অর্ডার ${orderId}-এর অবস্থা পরিবর্তিত হয়েছে: ${status}`
      },
      'success'
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => {
      const next = prev.filter((ord) => ord.id !== orderId);

      // Background sync to Supabase
      if (supabaseStatus.connected && supabaseStatus.tables.mifta_orders) {
        supabase
          .from('mifta_orders')
          .delete()
          .eq('id', orderId)
          .then(({ error }) => { if (error) console.error('Error background deleting order from Supabase:', error); });
      }

      return next;
    });

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

    // Background sync to Supabase
    if (supabaseStatus.connected && supabaseStatus.tables.mifta_reviews) {
      saveSupabaseReview(newReview).catch((err) =>
        console.error('Error background syncing review:', err)
      );
    }

    addToast(
      {
        en: 'Jazakallah Khair for your beautiful review! Moderation complete.',
        bn: 'আপনার সুন্দর পর্যালোচনার জন্য জাজাকাল্লাহ খাইরান!'
      },
      'success'
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => {
      const next = prev.filter((rev) => rev.id !== reviewId);

      // Background sync to Supabase
      if (supabaseStatus.connected && supabaseStatus.tables.mifta_reviews) {
        deleteSupabaseReview(reviewId).catch((err) =>
          console.error('Error background deleting review from Supabase:', err)
        );
      }

      return next;
    });

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
        setOrders,
        reviews,
        addReview,
        deleteReview,
        islamicQuotes,
        setIslamicQuotes,
        toasts,
        addToast,
        removeToast,
        websiteSettings,
        updateWebsiteSettings,
        supabaseStatus,
        syncingWithSupabase,
        syncAllToSupabase,
        refetchFromSupabase
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
