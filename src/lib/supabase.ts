import { createClient } from '@supabase/supabase-js';
import { Product, Order, Review, Coupon, AppNotification, UserProfile } from '../types';

// Read values from Vite environment or fall back to the provided values directly
const supabaseUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL || 'https://wyouwojqsujhofsivywe.supabase.co';
const supabaseAnonKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5b3V3b2pxc3VqaG9mc2l2eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODEwODksImV4cCI6MjA5ODA1NzA4OX0.DAgyGWRrzksDY13wfwOuBkcp1q6nPHU8C2ShfclFYY0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Checks if a table exists or is accessible.
 * If Supabase returns a 404 or a "relation does not exist" error, it returns false.
 */
async function testTableAccess(tableName: string): Promise<boolean> {
  try {
    // Use select('*') instead of select('id') because some tables (like user_profiles) might not have an 'id' column
    const { error } = await supabase.from(tableName).select('*').limit(1);
    if (error && (error.code === 'PGRST116' || error.message.includes('does not exist') || error.message.includes('404'))) {
      return false;
    }
    // A 400 error about a column not existing shouldn't mean the table is missing, 
    // but for simplicity we return false if there's any error indicating access issues
    if (error) {
      console.warn(`Supabase access check for ${tableName}:`, error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// 1. WEBSITE SETTINGS HELPERS
export async function getSupabaseWebsiteSettings() {
  try {
    const { data, error } = await supabase
      .from('mifta_website_settings')
      .select('settings')
      .eq('id', 'mifta_config')
      .single();
    if (error) throw error;
    return data?.settings || null;
  } catch (err) {
    console.warn('Supabase website settings fetch failed (Table may not exist yet):', err);
    return null;
  }
}

export async function saveSupabaseWebsiteSettings(settings: any) {
  try {
    const { error } = await supabase
      .from('mifta_website_settings')
      .upsert({ id: 'mifta_config', settings }, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase website settings save failed:', err);
    return false;
  }
}

// 2. PRODUCTS HELPERS
export async function getSupabaseProducts(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('mifta_products')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    if (!data) return null;

    // Map DB columns to Frontend interface
    return data.map((row: any) => {
      const description = row.description || { en: '', bn: '' };
      return {
        id: row.id,
        name: row.name,
        category: row.category,
        price: row.price,
        originalPrice: row.original_price,
        images: row.images || [],
        rating: row.rating || 5,
        reviewsCount: row.reviews_count || 0,
        description: {
          en: description.en || '',
          bn: description.bn || ''
        },
        specifications: row.specifications || { en: [], bn: [] },
        benefits: row.benefits || { en: [], bn: [] },
        usage: row.usage || { en: '', bn: '' },
        stock: row.stock,
        isBestSeller: row.featured || row.is_best_seller,
        isNewArrival: row.is_new_arrival,
        isTrending: row.is_trending,
        isFlashSale: row.flash_sale || row.is_flash_sale,
        flashSaleDiscount: row.flash_sale_discount || row.flash_sale_discount,
        sizePrices: row.size_prices || description.sizePrices || undefined,
        sizeOriginalPrices: row.size_original_prices || description.sizeOriginalPrices || undefined
      };
    });
  } catch (err) {
    console.warn('Supabase products fetch failed (Table may not exist yet):', err);
    return null;
  }
}

export async function saveSupabaseProduct(product: Product) {
  try {
    const { error } = await supabase
      .from('mifta_products')
      .upsert({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        original_price: product.originalPrice,
        images: product.images,
        rating: product.rating,
        reviews_count: product.reviewsCount,
        description: {
          en: product.description.en,
          bn: product.description.bn,
          sizePrices: product.sizePrices,
          sizeOriginalPrices: product.sizeOriginalPrices
        },
        specifications: product.specifications,
        benefits: product.benefits,
        usage: product.usage,
        stock: product.stock,
        is_best_seller: product.isBestSeller,
        is_new_arrival: product.isNewArrival,
        is_trending: product.isTrending,
        is_flash_sale: product.isFlashSale,
        flash_sale_discount: product.flashSaleDiscount
      }, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase product upsert failed:', err);
    return false;
  }
}

export async function deleteSupabaseProduct(productId: string) {
  try {
    const { error } = await supabase
      .from('mifta_products')
      .delete()
      .eq('id', productId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase product deletion failed:', err);
    return false;
  }
}

// 3. ORDERS HELPERS
export function parseSerializedAddress(serializedAddress: string): {
  address: string;
  upazila?: string;
  transactionId?: string;
  advancePaidAmount?: number;
} {
  const mainAddress = serializedAddress || '';
  if (mainAddress.includes('|||')) {
    const parts = mainAddress.split('|||');
    const address = parts[0] || '';
    const upazila = parts[1] || '';
    const transactionId = parts[2] || '';
    let advancePaidAmount: number | undefined = undefined;
    if (parts[3]) {
      const val = Number(parts[3]);
      if (!isNaN(val)) {
        advancePaidAmount = val;
      }
    }
    return {
      address,
      upazila: upazila || undefined,
      transactionId: transactionId || undefined,
      advancePaidAmount
    };
  }
  return { address: mainAddress };
}

export function serializeAddress(
  address: string,
  upazila?: string,
  transactionId?: string,
  advancePaidAmount?: number
): string {
  return [
    address || '',
    upazila || '',
    transactionId || '',
    advancePaidAmount !== undefined ? String(advancePaidAmount) : ''
  ].join('|||');
}

export async function getSupabaseOrders(): Promise<Order[] | null> {
  try {
    // 1. Try direct Supabase fetch first (highly reliable on mobile/absolute URL)
    const { data, error } = await supabase
      .from('mifta_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((row: any) => {
        const parsed = parseSerializedAddress(row.address);
        return {
          id: row.id,
          date: row.date,
          customerName: row.customer_name,
          phone: row.phone,
          address: parsed.address,
          district: row.district,
          division: row.division,
          upazila: parsed.upazila,
          items: Array.isArray(row.items) ? row.items : (typeof row.items === 'string' ? JSON.parse(row.items) : []),
          subtotal: Number(row.subtotal),
          discount: Number(row.discount || 0),
          shipping: Number(row.shipping || 0),
          total: Number(row.total),
          couponCode: row.coupon_code,
          paymentMethod: row.payment_method,
          paymentStatus: row.payment_status,
          transactionId: parsed.transactionId,
          advancePaidAmount: parsed.advancePaidAmount,
          orderStatus: row.order_status,
          trackingNumber: row.tracking_number
        };
      });
    }

    console.warn('Direct Supabase orders fetch failed, trying secure server API...', error?.message);

    // 2. Fallback to server API proxy if direct fetch fails
    const response = await fetch('/api/orders');
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    const resData = await response.json();
    if (!resData.success) {
      throw new Error(resData.error || 'Server fetch failed');
    }
    const serverData = resData.data;
    if (!serverData) return null;

    return serverData.map((row: any) => {
      const parsed = parseSerializedAddress(row.address);
      return {
        id: row.id,
        date: row.date,
        customerName: row.customer_name,
        phone: row.phone,
        address: parsed.address,
        district: row.district,
        division: row.division,
        upazila: parsed.upazila,
        items: Array.isArray(row.items) ? row.items : (typeof row.items === 'string' ? JSON.parse(row.items) : []),
        subtotal: Number(row.subtotal),
        discount: Number(row.discount || 0),
        shipping: Number(row.shipping || 0),
        total: Number(row.total),
        couponCode: row.coupon_code,
        paymentMethod: row.payment_method,
        paymentStatus: row.payment_status,
        transactionId: parsed.transactionId,
        advancePaidAmount: parsed.advancePaidAmount,
        orderStatus: row.order_status,
        trackingNumber: row.tracking_number
      };
    });
  } catch (err) {
    console.warn('Supabase orders fetch failed via both direct client and secure API:', err);
    return null;
  }
}

export async function saveSupabaseOrder(order: Order) {
  try {
    const serializedAddr = serializeAddress(
      order.address,
      order.upazila,
      order.transactionId,
      order.advancePaidAmount
    );

    const dbOrder = {
      id: order.id,
      date: order.date || new Date().toISOString(),
      customer_name: order.customerName || 'No Name',
      phone: order.phone || 'No Phone',
      address: serializedAddr,
      district: order.district || 'Default',
      division: order.division || 'Default',
      items: Array.isArray(order.items) ? order.items : [],
      subtotal: typeof order.subtotal === 'number' ? order.subtotal : 0,
      discount: typeof order.discount === 'number' ? order.discount : 0,
      shipping: typeof order.shipping === 'number' ? order.shipping : 0,
      total: typeof order.total === 'number' ? order.total : 0,
      coupon_code: order.couponCode || null,
      payment_method: order.paymentMethod || 'cod',
      payment_status: order.paymentStatus || 'pending',
      order_status: order.orderStatus || 'pending',
      tracking_number: order.trackingNumber || null
    };

    // 1. Try direct Supabase upsert first (highly reliable on mobile/absolute URL)
    const { error } = await supabase
      .from('mifta_orders')
      .upsert(dbOrder, { onConflict: 'id' });

    if (!error) {
      console.log(`Order ${order.id} saved directly to Supabase successfully.`);
      return true;
    }

    console.warn('Direct Supabase order upsert failed, trying secure server API...', error.message);

    // 2. Fallback to server API proxy if direct save fails
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dbOrder)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server status: ${response.status} - ${errText}`);
    }

    const resData = await response.json();
    if (!resData.success) {
      throw new Error(resData.error || 'Server upsert failed');
    }

    return true;
  } catch (err) {
    console.error('Supabase order upsert failed via both direct client and secure API:', err);
    return false;
  }
}

// 4. REVIEWS HELPERS
export async function getSupabaseReviews(): Promise<Review[] | null> {
  try {
    const { data, error } = await supabase
      .from('mifta_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return null;

    return data.map((row: any) => ({
      id: row.id,
      productId: row.product_id,
      userName: row.user_name,
      rating: row.rating,
      comment: row.comment,
      date: row.date,
      verified: row.verified
    }));
  } catch (err) {
    console.warn('Supabase reviews fetch failed (Table may not exist yet):', err);
    return null;
  }
}

export async function saveSupabaseReview(review: Review) {
  try {
    const { error } = await supabase
      .from('mifta_reviews')
      .upsert({
        id: review.id,
        product_id: review.productId,
        user_name: review.userName,
        rating: review.rating,
        comment: review.comment,
        date: review.date,
        verified: review.verified
      }, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase review upsert failed:', err);
    return false;
  }
}

export async function deleteSupabaseReview(reviewId: string) {
  try {
    const { error } = await supabase
      .from('mifta_reviews')
      .delete()
      .eq('id', reviewId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase review deletion failed:', err);
    return false;
  }
}

// 5. COUPONS HELPERS
export async function getSupabaseCoupons(): Promise<Coupon[] | null> {
  try {
    const { data, error } = await supabase
      .from('mifta_coupons')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data) return null;

    return data.map((row: any) => ({
      code: row.code,
      discountType: row.discount_type,
      discountValue: row.discount_value,
      minOrderValue: row.min_order_value,
      description: row.description,
      isActive: row.is_active
    }));
  } catch (err) {
    console.warn('Supabase coupons fetch failed (Table may not exist yet):', err);
    return null;
  }
}

export async function saveSupabaseCoupon(coupon: Coupon) {
  try {
    const { error } = await supabase
      .from('mifta_coupons')
      .upsert({
        code: coupon.code,
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        min_order_value: coupon.minOrderValue,
        description: coupon.description,
        is_active: coupon.isActive
      }, { onConflict: 'code' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase coupon upsert failed:', err);
    return false;
  }
}

// 5.5. NOTIFICATIONS HELPERS
export async function getSupabaseNotifications(): Promise<AppNotification[] | null> {
  try {
    const { data, error } = await supabase
      .from('mifta_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return null;

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      type: row.type,
      referenceId: row.reference_id,
      isRead: row.is_read,
      createdAt: row.created_at
    }));
  } catch (err) {
    console.warn('Supabase notifications fetch failed (Table may not exist yet):', err);
    return null;
  }
}

export async function saveSupabaseNotification(notif: AppNotification) {
  try {
    const { error } = await supabase
      .from('mifta_notifications')
      .upsert({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        reference_id: notif.referenceId,
        is_read: notif.isRead,
        created_at: notif.createdAt
      }, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error('Supabase notification upsert failed:', err.message || err);
    return false;
  }
}

export async function deleteSupabaseNotification(notifId: string) {
  try {
    const { error } = await supabase
      .from('mifta_notifications')
      .delete()
      .eq('id', notifId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase notification deletion failed:', err);
    return false;
  }
}

export async function markSupabaseNotificationAsRead(notifId: string) {
  try {
    const { error } = await supabase
      .from('mifta_notifications')
      .update({ is_read: true })
      .eq('id', notifId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase notification status update failed:', err);
    return false;
  }
}

export async function markAllSupabaseNotificationsRead() {
  try {
    const { error } = await supabase
      .from('mifta_notifications')
      .update({ is_read: true })
      .eq('is_read', false);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase mark all notifications read failed:', err);
    return false;
  }
}

// 5.6. USER PROFILES & FCM HELPERS
export async function getSupabaseUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('mifta_user_profiles')
      .select('*')
      .eq('uid', uid)
      .single();
    
    if (error) throw error;
    if (!data) return null;

    return {
      uid: data.uid,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      district: data.district,
      division: data.division,
      upazila: data.upazila,
      photoURL: data.photo_url,
      wishlist: data.wishlist || [],
      recentlyViewed: data.recently_viewed || [],
      fcmToken: data.fcm_token
    };
  } catch (err) {
    console.warn('Supabase user profile fetch failed:', err);
    return null;
  }
}

export async function saveSupabaseUserProfile(profile: UserProfile) {
  try {
    const { error } = await supabase
      .from('mifta_user_profiles')
      .upsert({
        uid: profile.uid,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        district: profile.district,
        division: profile.division,
        upazila: profile.upazila,
        photo_url: profile.photoURL,
        wishlist: profile.wishlist,
        recently_viewed: profile.recentlyViewed,
        fcm_token: profile.fcmToken
      }, { onConflict: 'uid' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase user profile upsert failed:', err);
    return false;
  }
}

export async function updateSupabaseFCMToken(uid: string, token: string) {
  try {
    const { data: profile } = await supabase
      .from('mifta_user_profiles')
      .select('fcm_token')
      .eq('uid', uid)
      .single();

    let tokens: string[] = [];
    if (profile && profile.fcm_token) {
      tokens = profile.fcm_token.split(',').filter((t: string) => t.trim() !== '');
    }
    
    if (!tokens.includes(token)) {
      tokens.push(token);
    }

    // Keep the last 10 tokens to avoid overflowing the text field over time
    if (tokens.length > 10) {
      tokens = tokens.slice(tokens.length - 10);
    }

    const { error } = await supabase
      .from('mifta_user_profiles')
      .update({ fcm_token: tokens.join(',') })
      .eq('uid', uid);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase FCM token update failed:', err);
    return false;
  }
}

// 6. DB CONNECTION CHECK
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  tables: { [key: string]: boolean };
}> {
  const tables = {
    mifta_website_settings: await testTableAccess('mifta_website_settings'),
    mifta_products: await testTableAccess('mifta_products'),
    mifta_orders: await testTableAccess('mifta_orders'),
    mifta_reviews: await testTableAccess('mifta_reviews'),
    mifta_coupons: await testTableAccess('mifta_coupons'),
    mifta_notifications: await testTableAccess('mifta_notifications'),
    mifta_user_profiles: await testTableAccess('mifta_user_profiles'),
  };

  const connected = Object.values(tables).some((t) => t === true);

  return { connected, tables };
}

// 7. STORAGE HELPERS
export async function uploadProductImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error('Error uploading image:', err);
    return null;
  }
}

// SQL helper query to copy-paste into Supabase SQL Editor
export const SUPABASE_SQL_CREATION_QUERY = `-- ==========================================
-- MIFTA ATTAR HOUSE: SUPABASE SCHEMA SETUP
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==========================================

-- 1. Create mifta_website_settings table
CREATE TABLE IF NOT EXISTS public.mifta_website_settings (
  id TEXT PRIMARY KEY,
  settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS & Set policy (Select/Update for all for simplicity/demo, customize in prod)
ALTER TABLE public.mifta_website_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read website settings" ON public.mifta_website_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert website settings" ON public.mifta_website_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update website settings" ON public.mifta_website_settings FOR UPDATE USING (true);

-- 2. Create mifta_products table
CREATE TABLE IF NOT EXISTS public.mifta_products (
  id TEXT PRIMARY KEY,
  name JSONB NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating NUMERIC DEFAULT 5,
  reviews_count INTEGER DEFAULT 0,
  description JSONB NOT NULL,
  specifications JSONB NOT NULL DEFAULT '{"en": [], "bn": []}'::jsonb,
  benefits JSONB NOT NULL DEFAULT '{"en": [], "bn": []}'::jsonb,
  usage JSONB NOT NULL DEFAULT '{"en": "", "bn": ""}'::jsonb,
  stock INTEGER DEFAULT 10,
  is_best_seller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_flash_sale BOOLEAN DEFAULT false,
  flash_sale_discount INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mifta_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read products" ON public.mifta_products FOR SELECT USING (true);
CREATE POLICY "Allow public write products" ON public.mifta_products FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow public delete products" ON public.mifta_products;
CREATE POLICY "Allow public delete products" ON public.mifta_products FOR DELETE USING (true);

-- 3. Create mifta_orders table
CREATE TABLE IF NOT EXISTS public.mifta_orders (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  division TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  shipping NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  coupon_code TEXT,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  order_status TEXT NOT NULL,
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mifta_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read orders" ON public.mifta_orders FOR SELECT USING (true);
CREATE POLICY "Allow public write orders" ON public.mifta_orders FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow public delete orders" ON public.mifta_orders;
CREATE POLICY "Allow public delete orders" ON public.mifta_orders FOR DELETE USING (true);

-- 4. Create mifta_reviews table
CREATE TABLE IF NOT EXISTS public.mifta_reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  date TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mifta_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read reviews" ON public.mifta_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public write reviews" ON public.mifta_reviews FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow public delete reviews" ON public.mifta_reviews;
CREATE POLICY "Allow public delete reviews" ON public.mifta_reviews FOR DELETE USING (true);

-- 5. Create mifta_coupons table
CREATE TABLE IF NOT EXISTS public.mifta_coupons (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  min_order_value NUMERIC,
  description JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mifta_coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read coupons" ON public.mifta_coupons FOR SELECT USING (true);
CREATE POLICY "Allow public write coupons" ON public.mifta_coupons FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow public delete coupons" ON public.mifta_coupons;
CREATE POLICY "Allow public delete coupons" ON public.mifta_coupons FOR DELETE USING (true);

-- 5.5. Create mifta_notifications table
CREATE TABLE IF NOT EXISTS public.mifta_notifications (
  id TEXT PRIMARY KEY,
  title JSONB NOT NULL,
  message JSONB NOT NULL,
  type TEXT NOT NULL,
  reference_id TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mifta_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read notifications" ON public.mifta_notifications FOR SELECT USING (true);
CREATE POLICY "Allow public write notifications" ON public.mifta_notifications FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow public delete notifications" ON public.mifta_notifications;
CREATE POLICY "Allow public delete notifications" ON public.mifta_notifications FOR DELETE USING (true);

-- 5.6. Create mifta_user_profiles table
CREATE TABLE IF NOT EXISTS public.mifta_user_profiles (
  uid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  district TEXT,
  division TEXT,
  upazila TEXT,
  photo_url TEXT,
  wishlist JSONB DEFAULT '[]'::jsonb,
  recently_viewed JSONB DEFAULT '[]'::jsonb,
  fcm_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mifta_user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read profiles" ON public.mifta_user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public write profiles" ON public.mifta_user_profiles FOR ALL USING (true);

-- 6. Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Set up access policies for the bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product-images' );
CREATE POLICY "Allow Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product-images' );
CREATE POLICY "Allow Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'product-images' );
CREATE POLICY "Allow Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'product-images' );
`;
