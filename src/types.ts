/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'bn';
export type Theme = 'light' | 'dark';

export interface Product {
  id: string;
  name: { en: string; bn: string };
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewsCount: number;
  description: { en: string; bn: string };
  specifications: {
    en: { label: string; value: string }[];
    bn: { label: string; value: string }[];
  };
  benefits: { en: string[]; bn: string[] };
  usage: { en: string; bn: string };
  stock: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  flashSaleDiscount?: number; // e.g., 20 for 20% off
  sizePrices?: { [size: string]: number };
}

export interface Category {
  id: string;
  name: { en: string; bn: string };
  icon: string; // lucide icon name
  image: string;
  description: { en: string; bn: string };
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string; // e.g. "3ml", "6ml", "12ml"
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  description: { en: string; bn: string };
  isActive: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  district?: string;
  division?: string;
  upazila?: string;
  photoURL?: string;
  wishlist: string[]; // product IDs
  recentlyViewed: string[]; // product IDs
  fcmToken?: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  division: string;
  upazila?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    image?: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'rocket';
  paymentStatus: 'pending' | 'paid';
  transactionId?: string;
  advancePaidAmount?: number;
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
}

export interface IslamicQuote {
  quote: { en: string; bn: string };
  source: { en: string; bn: string };
}

export interface HeroSlide {
  id: string;
  url: string;
  title: { en: string; bn: string };
  subtitle: { en: string; bn: string };
}

export interface AppNotification {
  id: string;
  title: { en: string; bn: string };
  message: { en: string; bn: string };
  type: 'new_order' | 'low_stock' | 'system' | 'new_review';
  referenceId?: string; // e.g. order ID, product ID
  isRead: boolean;
  createdAt: string;
}

export function getProductPriceForSize(product: Product, size?: string): number {
  if (!size || product.category === 'natural' || product.category === 'gifts') {
    return product.price;
  }

  // Check if explicit size price exists
  if (product.sizePrices && product.sizePrices[size] !== undefined) {
    return product.sizePrices[size];
  }

  // Fallback dynamic pricing ratios
  const basePrice = product.price; // assumed as the 6ml price
  switch (size) {
    case '3ml':
      return Math.round(basePrice * 0.65);
    case '6ml':
      return basePrice;
    case '12ml':
      return Math.round(basePrice * 1.75);
    case '20ml':
      return Math.round(basePrice * 2.85);
    case '30ml':
      return Math.round(basePrice * 4.0);
    case '40ml':
      return Math.round(basePrice * 5.2);
    case '50ml':
      return Math.round(basePrice * 6.2);
    default:
      return basePrice;
  }
}

