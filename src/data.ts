/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Coupon, IslamicQuote, HeroSlide } from './types';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200",
    title: { en: "Premium Attar Collection", bn: "প্রিমিয়াম আতর কালেকশন" },
    subtitle: { en: "Pure & Long Lasting", bn: "শতভাগ খাঁটি ও দীর্ঘস্থায়ী" }
  },
  {
    id: 'slide-2',
    url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1200",
    title: { en: "Luxury Fragrances", bn: "বিলাসবহুল সুগন্ধি" },
    subtitle: { en: "Imported from Dubai", bn: "দুবাই থেকে আমদানিকৃত" }
  },
  {
    id: 'slide-3',
    url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200",
    title: { en: "Floral Extracts", bn: "ফ্লোরাল নির্যাস" },
    subtitle: { en: "Essence of Nature", bn: "প্রকৃতির সতেজ সুবাস" }
  },
  {
    id: 'slide-4',
    url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200",
    title: { en: "Royal Oud Collection", bn: "রয়্যাল উদ কালেকশন" },
    subtitle: { en: "The King of Fragrances", bn: "সুগন্ধির রাজা" }
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'oud',
    name: { en: 'Oud Collection', bn: 'উদ কালেকশন' },
    icon: 'Crown',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    description: { en: 'Royal, deep and long-lasting oriental agarwood fragrances.', bn: 'রাজকীয়, দীর্ঘস্থায়ী এবং গভীর সুবাসযুক্ত আগরউড সুগন্ধি।' }
  },
  {
    id: 'arabic',
    name: { en: 'Arabic Attar', bn: 'আরবি আতর' },
    icon: 'Compass',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    description: { en: 'Traditional Middle Eastern non-alcoholic concentrated perfumes.', bn: 'ঐতিহ্যবাহী মধ্যপ্রাচ্যের অ্যালকোহল মুক্ত ঘন আতর সুগন্ধি।' }
  },
  {
    id: 'floral',
    name: { en: 'Floral Collection', bn: 'ফ্লোরাল কালেকশন' },
    icon: 'Flower',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
    description: { en: 'Nectarous extracts of Rose, Jasmine, and Rajanigandha.', bn: 'গোলাপ, জেসমিন এবং রজনীগন্ধার প্রাকৃতিক নির্যাসের চমৎকার সুবাস।' }
  },
  {
    id: 'fresh',
    name: { en: 'Sporty & Fresh', bn: 'স্পোর্টি ও ফ্রেশ' },
    icon: 'Wind',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600',
    description: { en: 'Energetic, clean, oceanic and masculine active wear blends.', bn: 'প্রাণবন্ত, পরিচ্ছন্ন, সমুদ্রের সতেজতা ও পুরুষালী সুবাস।' }
  },
  {
    id: 'natural',
    name: { en: 'Natural & Health', bn: 'ন্যাচারাল ও হেলথ' },
    icon: 'Leaf',
    image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&q=80&w=600',
    description: { en: 'Purity-certified Kalojira, premium Honey, and organic oils.', bn: 'শতভাগ খাঁটি কালোজিরা, প্রিমিয়াম মধু এবং অর্গানিক তেল।' }
  },
  {
    id: 'gifts',
    name: { en: 'Gift Boxes', bn: 'গিফট বক্স কালেকশন' },
    icon: 'Gift',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600',
    description: { en: 'Exquisite custom packaging for your loved ones on Sunnah occasions.', bn: 'প্রিয়জনদের জন্য সুন্নাহ সম্মত উপলক্ষ্যে চমৎকার উপহার সামগ্রী।' }
  }
];

export const PRODUCTS: Product[] = [];

export const ISLAMIC_QUOTES: IslamicQuote[] = [
  {
    quote: {
      en: '"The Messenger of Allah (ﷺ) said: Cleanliness is half of faith, and fragrance is the food of the spirit..."',
      bn: '"রাসূলুল্লাহ (সাঃ) বলেছেন: পবিত্রতা হচ্ছে ঈমানের অর্ধেক, আর সুগন্ধি হচ্ছে আত্মার খাদ্য..."'
    },
    source: {
      en: 'Sahih Muslim & Sunan al-Nasa\'i',
      bn: 'সহীহ মুসলিম ও সুনানে নাসায়ী'
    }
  },
  {
    quote: {
      en: '"I was made to love three things of your world: Women, fragrance, and my solace is in prayer."',
      bn: '"তোমাদের পার্থিব জগতের তিনটি জিনিস আমার কাছে অত্যন্ত প্রিয় করা হয়েছে: নারী, সুগন্ধি, আর আমার চোখের শীতলতা রাখা হয়েছে সালাতে।"'
    },
    source: {
      en: 'Prophet Muhammad (ﷺ) - Sunan an-Nasa\'i',
      bn: 'মহানবী হযরত মুহাম্মদ (সাঃ) - সুনানে নাসায়ী'
    }
  },
  {
    quote: {
      en: '"Whoever is offered fragrance should not refuse it, for it is easy to carry and has a pleasant scent."',
      bn: '"যাকে সুগন্ধি উপহার দেওয়া হয় সে যেন তা প্রত্যাখ্যান না করে, কারণ এটি বহন করা সহজ এবং এর সুবাস অত্যন্ত মনোরম।"'
    },
    source: {
      en: 'Prophet Muhammad (ﷺ) - Sahih Muslim',
      bn: 'মহানবী হযরত মুহাম্মদ (সাঃ) - সহীহ মুসলিম'
    }
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'SUNNAH10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 500,
    description: { en: 'Get 10% Off on all orders above ৳500!', bn: '৳৫০০ এর উপরে সকল অর্ডারে ১০% ছাড় পান!' },
    isActive: true
  },
  {
    code: 'MIFTAGOLD',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 1000,
    description: { en: 'Flat ৳100 Off on orders above ৳1000!', bn: '৳১০০০ এর বেশি অর্ডারে সরাসরি ৳১০০ ছাড়!' },
    isActive: true
  },
  {
    code: 'FREEODOR',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 1500,
    description: { en: 'Enjoy 15% discount on bulk purchases above ৳1500!', bn: '৳১৫০০ এর বেশি অর্ডারে বিশেষ ১৫% ছাড়!' },
    isActive: true
  }
];
