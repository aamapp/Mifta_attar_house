import { createClient } from '@supabase/supabase-js';
import { Product, Order, Review, Coupon } from '../types';

// Read values from Vite environment or fall back to the provided values directly
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://wyouwojqsujhofsivywe.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5b3V3b2pxc3VqaG9mc2l2eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODEwODksImV4cCI6MjA5ODA1NzA4OX0.DAgyGWRrzksDY13wfwOuBkcp1q6nPHU8C2ShfclFYY0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Checks if a table exists or is accessible.
 * If Supabase returns a 404 or a "relation does not exist" error, it returns false.
 */
async function testTableAccess(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select('id').limit(1);
    if (error && (error.code === 'PGRST116' || error.message.includes('does not exist') || error.message.includes('404'))) {
      return false;
    }
    return !error;
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
    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
      originalPrice: row.original_price,
      images: row.images || [],
      rating: row.rating || 5,
      reviewsCount: row.reviews_count || 0,
      description: row.description,
      specifications: row.specifications || { en: [], bn: [] },
      benefits: row.benefits || { en: [], bn: [] },
      usage: row.usage || { en: '', bn: '' },
      stock: row.stock,
      isBestSeller: row.featured || row.is_best_seller,
      isNewArrival: row.is_new_arrival,
      isTrending: row.is_trending,
      isFlashSale: row.flash_sale || row.is_flash_sale,
      flashSaleDiscount: row.flash_sale_discount || row.flash_sale_discount
    }));
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
        description: product.description,
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
export async function getSupabaseOrders(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('mifta_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return null;

    return data.map((row: any) => ({
      id: row.id,
      date: row.date,
      customerName: row.customer_name,
      phone: row.phone,
      address: row.address,
      district: row.district,
      division: row.division,
      items: row.items,
      subtotal: row.subtotal,
      discount: row.discount,
      shipping: row.shipping,
      total: row.total,
      couponCode: row.coupon_code,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      orderStatus: row.order_status,
      trackingNumber: row.tracking_number
    }));
  } catch (err) {
    console.warn('Supabase orders fetch failed (Table may not exist yet):', err);
    return null;
  }
}

export async function saveSupabaseOrder(order: Order) {
  try {
    const { error } = await supabase
      .from('mifta_orders')
      .upsert({
        id: order.id,
        date: order.date,
        customer_name: order.customerName,
        phone: order.phone,
        address: order.address,
        district: order.district,
        division: order.division,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        total: order.total,
        coupon_code: order.couponCode,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus,
        tracking_number: order.trackingNumber
      }, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase order upsert failed:', err);
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
  };

  const connected = Object.values(tables).some((t) => t === true);

  return { connected, tables };
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
`;
