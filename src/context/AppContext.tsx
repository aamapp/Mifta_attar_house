/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Language, Theme, Product, Category, CartItem, Coupon, UserProfile, Order, Review, IslamicQuote, HeroSlide, AppNotification } from '../types';
import { PRODUCTS, CATEGORIES, INITIAL_COUPONS, ISLAMIC_QUOTES, HERO_SLIDES } from '../data';
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
  getSupabaseNotifications,
  saveSupabaseNotification,
  deleteSupabaseNotification,
  markSupabaseNotificationAsRead,
  markAllSupabaseNotificationsRead,
  checkSupabaseConnection,
  getSupabaseUserProfile,
  saveSupabaseUserProfile,
  updateSupabaseFCMToken
} from '../lib/supabase';
import {
  saveFirebaseUserProfile,
  updateFirebaseFCMToken,
  getFirebaseUserProfile
} from '../lib/firebase-helpers';

declare global {
  interface Window {
    receiveFCMTokenFromAndroid: (token: string | null) => void;
  }
}

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
    upazila?: string;
    deliveryOption: string;
    paymentOption: string;
    transactionId?: string;
    advancePaidAmount?: number;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  deleteOrder: (orderId: string) => Promise<void>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  deleteReview: (reviewId: string) => void;
  
  // Islamic Quotes
  islamicQuotes: IslamicQuote[];
  setIslamicQuotes: React.Dispatch<React.SetStateAction<IslamicQuote[]>>;
  
  // Hero Banners
  heroSlides: HeroSlide[];
  setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
  
  // Toast Notifications
  toasts: { id: string; message: { en: string; bn: string }; type: 'success' | 'error' | 'info' }[];
  addToast: (msg: { en: string; bn: string }, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Real-time Notifications
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  requestNotificationPermission: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  
  // FCM Token
  fcmToken: string | null;

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

  // Reset App Data
  resetAppData: () => void;

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
            // Sync hero slides state if they are saved in settings
            if (settings.heroSlides && Array.isArray(settings.heroSlides) && settings.heroSlides.length > 0) {
              setHeroSlidesState(settings.heroSlides);
              localStorage.setItem('mifta_hero_slides', JSON.stringify(settings.heroSlides));
            }
          }
        }

        // Load Products
        if (status.tables.mifta_products) {
          const dbProducts = await getSupabaseProducts();
          if (dbProducts) {
            setRawProducts(dbProducts);
            localStorage.setItem('mifta_products', JSON.stringify(dbProducts));
          }
        }

        // Load Coupons
        if (status.tables.mifta_coupons) {
          const dbCoupons = await getSupabaseCoupons();
          if (dbCoupons) {
            setRawCoupons(dbCoupons);
            localStorage.setItem('mifta_coupons', JSON.stringify(dbCoupons));
          }
        }

        // Load Reviews
        if (status.tables.mifta_reviews) {
          const dbReviews = await getSupabaseReviews();
          if (dbReviews) {
            setReviews(dbReviews);
            localStorage.setItem('mifta_reviews', JSON.stringify(dbReviews));
          }
        }

        // Load Orders
        if (status.tables.mifta_orders) {
          const dbOrders = await getSupabaseOrders();
          if (dbOrders) {
            setOrders(dbOrders);
            localStorage.setItem('mifta_orders', JSON.stringify(dbOrders));
          }
        }

        // Load Notifications
        if (status.tables.mifta_notifications) {
          const dbNotifs = await getSupabaseNotifications();
          if (dbNotifs) {
            setNotifications(dbNotifs);
            localStorage.setItem('mifta_notifications', JSON.stringify(dbNotifs));
          }
        }
      }
    } catch (err) {
      console.error('Failed to refetch data from Supabase:', err);
    } finally {
      setSyncingWithSupabase(false);
    }
  };

  const resetAppData = () => {
    localStorage.clear();
    window.location.reload();
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
    const initFetch = async () => {
      const status = await checkSupabaseConnection();
      setSupabaseStatus(status);
      
      // Always refetch to ensure we have the latest data (orders, etc.) on app start
      await refetchFromSupabase();
    };
    
    initFetch();

    // Setup real-time subscription for notifications
    const subscription = supabase
      .channel('public:mifta_notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mifta_notifications' }, (payload) => {
        const newNotif: AppNotification = {
          id: payload.new.id,
          title: payload.new.title,
          message: payload.new.message,
          type: payload.new.type,
          referenceId: payload.new.reference_id,
          isRead: payload.new.is_read,
          createdAt: payload.new.created_at
        };
        
        setNotifications(prev => {
          if (prev.some(n => n.id === newNotif.id)) return prev;
          const updated = [newNotif, ...prev];
          localStorage.setItem('mifta_notifications', JSON.stringify(updated));
          return updated;
        });
      })
      .subscribe();

    // Setup real-time subscription for orders
    const orderSubscription = supabase
      .channel('public:mifta_orders_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mifta_orders' }, async () => {
        const dbOrders = await getSupabaseOrders();
        if (dbOrders) {
           setOrders(dbOrders);
           localStorage.setItem('mifta_orders', JSON.stringify(dbOrders));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      orderSubscription.unsubscribe();
    };
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
        // We only want to sync what actually changed to avoid massive background loops
        // 1. Handle deletions
        const deleted = prev.filter(p => !next.some(n => n.id === p.id));
        deleted.forEach(p => {
          deleteSupabaseProduct(p.id).catch(e => console.error("Error background deleting product:", e));
        });
        
        // 2. Handle additions and updates
        // Find products that are in next but NOT in prev OR have changed
        const changedOrNew = next.filter(n => {
          const p = prev.find(old => old.id === n.id);
          return !p || JSON.stringify(p) !== JSON.stringify(n);
        });

        changedOrNew.forEach(p => {
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
    
    const initialOrders: Order[] = [];
    return initialOrders;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const local = localStorage.getItem('mifta_notifications');
    return local ? JSON.parse(local) : [];
  });

  const [fcmToken, setFcmToken] = useState<string | null>(() => {
    return localStorage.getItem('fcm_token_cache');
  });

  // Global interface for Android WebView to pass FCM token
  useEffect(() => {
    window.receiveFCMTokenFromAndroid = (token: string | null) => {
      console.log('Received FCM Token from Android:', token);
      if (token) {
        setFcmToken(token);
        localStorage.setItem('fcm_token_cache', token);
      }
    };

    return () => {
      // @ts-ignore
      delete window.receiveFCMTokenFromAndroid;
    };
  }, []);

  // Update FCM token in database when user is logged in
  useEffect(() => {
    if (user && fcmToken && user.uid !== 'mifta-guest-user') {
      if (user.fcmToken !== fcmToken) {
        // Update Supabase
        updateSupabaseFCMToken(user.uid, fcmToken).catch(err => 
          console.error('Error syncing FCM token to Supabase:', err)
        );
        // Update Firebase Firestore
        updateFirebaseFCMToken(user.uid, fcmToken).catch(err =>
          console.error('Error syncing FCM token to Firebase:', err)
        );
        // Also update local state
        setUser(prev => prev ? { ...prev, fcmToken } : null);
      }
    }
  }, [user?.uid, fcmToken]);

  const [islamicQuotes, setIslamicQuotesState] = useState<IslamicQuote[]>(() => {
    const local = localStorage.getItem('mifta_islamic_quotes');
    return local ? JSON.parse(local) : ISLAMIC_QUOTES;
  });

  const [heroSlides, setHeroSlidesState] = useState<HeroSlide[]>(() => {
    const local = localStorage.getItem('mifta_hero_slides');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing mifta_hero_slides:', e);
      }
    }
    // Try falling back to the heroSlides embedded in local website settings if any
    const localSettings = localStorage.getItem('mifta_website_settings');
    if (localSettings) {
      try {
        const parsedSettings = JSON.parse(localSettings);
        if (parsedSettings && parsedSettings.heroSlides && Array.isArray(parsedSettings.heroSlides) && parsedSettings.heroSlides.length > 0) {
          return parsedSettings.heroSlides;
        }
      } catch (e) {
        // ignore
      }
    }
    return HERO_SLIDES;
  });

  const setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>> = (action) => {
    setHeroSlidesState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      localStorage.setItem('mifta_hero_slides', JSON.stringify(next));

      // Synchronize embedded heroSlides into websiteSettings
      setWebsiteSettings((prevSettings: any) => {
        const updated = { ...prevSettings, heroSlides: next };
        localStorage.setItem('mifta_website_settings', JSON.stringify(updated));

        // Sync to Supabase in background
        if (supabaseStatus.connected && supabaseStatus.tables.mifta_website_settings) {
          saveSupabaseWebsiteSettings(updated).catch((err) =>
            console.error('Error background syncing website settings with hero slides:', err)
          );
        }
        return updated;
      });

      return next;
    });
  };

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
    
    return [];
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
  // Real-time Notifications Functions
  const addNotification = async (notifData: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('mifta_notifications', JSON.stringify(updated));
      return updated;
    });

    // Save to Supabase
    await saveSupabaseNotification(newNotif);

    // Trigger Browser/System Notification
    if ('Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification(newNotif.title[language], {
        body: newNotif.message[language],
        icon: '/logo.png'
      });
    }
  };

  const requestNotificationPermission = () => {
    // Note: For Android WebView integration, ensure you handle this call in your WebChromeClient
    // and request Android's POST_NOTIFICATIONS permission.
    if ('Notification' in window) {
      window.Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          addToast({ en: 'Notifications enabled!', bn: 'নোটিফিকেশন সক্রিয় করা হয়েছে!' }, 'success');
        }
      });
    }
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      localStorage.setItem('mifta_notifications', JSON.stringify(updated));
      return updated;
    });
    await markSupabaseNotificationAsRead(id);
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('mifta_notifications', JSON.stringify(updated));
      return updated;
    });
    await markAllSupabaseNotificationsRead();
  };

  const deleteNotification = async (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('mifta_notifications', JSON.stringify(updated));
      return updated;
    });
    await deleteSupabaseNotification(id);
  };

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
      recentlyViewed: [],
      fcmToken: fcmToken || undefined
    };
    setUser(newUser);
    
    // Sync to Supabase
    saveSupabaseUserProfile(newUser);
    // Sync to Firebase
    saveFirebaseUserProfile(newUser);

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
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...profile };
      // Sync to Supabase
      saveSupabaseUserProfile(updated);
      // Sync to Firebase
      saveFirebaseUserProfile(updated);
      return updated;
    });
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
    transactionId?: string;
    advancePaidAmount?: number;
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
    const isFreeShipping = subtotal >= 1500 && shippingDetails.deliveryOption === 'dhaka';
    const shipping = isFreeShipping ? 0 : (shippingDetails.deliveryOption === 'dhaka' ? 80 : 160);
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
      transactionId: shippingDetails.transactionId,
      advancePaidAmount: shippingDetails.advancePaidAmount,
      orderStatus: 'pending'
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Trigger FCM Push for Admin
    fetch('https://miftaattarhouse.mamun30yr.workers.dev/api/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'ADMINS',
        title: language === 'en' ? 'New Order Received!' : 'নতুন অর্ডার এসেছে!',
        body: language === 'en' 
          ? `Order for ৳${newOrder.total} from ${newOrder.customerName}`
          : `${newOrder.customerName} এর কাছ থেকে ৳${newOrder.total} টাকার অর্ডার এসেছে।`,
        orderId: newOrder.id
      })
    }).catch(err => console.error("Auto-push error:", err));

    // Trigger Admin Notification
    addNotification({
      title: { 
        en: `New Order Received: ${newOrder.id}`, 
        bn: `নতুন অর্ডার পাওয়া গেছে: ${newOrder.id}` 
      },
      message: { 
        en: `A new order has been placed by ${newOrder.customerName} for ৳${newOrder.total}.`, 
        bn: `${newOrder.customerName} মোট ৳${newOrder.total} টাকার একটি নতুন অর্ডার করেছেন।` 
      },
      type: 'new_order',
      referenceId: newOrder.id
    });

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
    let updatedOrder: Order | undefined;

    setOrders((prev) => {
      const next = prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            orderStatus: status,
            paymentStatus: status === 'delivered' ? 'paid' : ord.paymentStatus,
            trackingNumber: status === 'shipped' && !ord.trackingNumber ? 'TRK-' + Math.random().toString(36).substring(2, 8).toUpperCase() : ord.trackingNumber
          };
          updatedOrder = updated;
          return updated;
        }
        return ord;
      });
      return next;
    });

    // Background sync to Supabase outside state updater
    // Give state a tiny bit of time to update locally before saving, though not strictly required
    setTimeout(() => {
      if (updatedOrder && supabaseStatus.connected && supabaseStatus.tables.mifta_orders) {
        saveSupabaseOrder(updatedOrder).catch((err) =>
          console.error('Error background syncing order status:', err)
        );
      }
    }, 0);

    addToast(
      {
        en: `Order ${orderId} status updated to: ${status}`,
        bn: `অর্ডার ${orderId}-এর অবস্থা পরিবর্তিত হয়েছে: ${status}`
      },
      'success'
    );
  };

  const deleteOrder = async (orderId: string) => {
    // Background sync to Supabase
    if (supabaseStatus.connected && supabaseStatus.tables.mifta_orders) {
      const { error } = await supabase
        .from('mifta_orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Error deleting order from Supabase:', error);
        addToast(
          { en: `Failed to delete order ${orderId}.`, bn: `অর্ডার ${orderId} মুছে ফেলা ব্যর্থ হয়েছে।` },
          'error'
        );
        return;
      }
    }

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
    // Background sync to Supabase
    if (supabaseStatus.connected && supabaseStatus.tables.mifta_reviews) {
      deleteSupabaseReview(reviewId).catch((err) =>
        console.error('Error background deleting review from Supabase:', err)
      );
    }

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
        setOrders,
        reviews,
        addReview,
        deleteReview,
        islamicQuotes,
        setIslamicQuotes,
        heroSlides,
        setHeroSlides,
        toasts,
        addToast,
        removeToast,
        websiteSettings,
        updateWebsiteSettings,
        notifications,
        addNotification,
        requestNotificationPermission,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        setNotifications,
        fcmToken,
        resetAppData,
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
