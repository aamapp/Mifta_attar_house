/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Coupon, IslamicQuote } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'oud',
    name: { en: 'Oud Collection', bn: 'উদ কালেকশন' },
    icon: 'Crown',
    image: '/src/assets/images/oud_collection_category_1782537041918.jpg',
    description: { en: 'Royal, deep and long-lasting oriental agarwood fragrances.', bn: 'রাজকীয়, দীর্ঘস্থায়ী এবং গভীর সুবাসযুক্ত আগরউড সুগন্ধি।' }
  },
  {
    id: 'arabic',
    name: { en: 'Arabic Attar', bn: 'আরবি আতর' },
    icon: 'Compass',
    image: '/src/assets/images/arabic_attar_category_1782537059066.jpg',
    description: { en: 'Traditional Middle Eastern non-alcoholic concentrated perfumes.', bn: 'ঐতিহ্যবাহী মধ্যপ্রাচ্যের অ্যালকোহল মুক্ত ঘন আতর সুগন্ধি।' }
  },
  {
    id: 'floral',
    name: { en: 'Floral Collection', bn: 'ফ্লোরাল কালেকশন' },
    icon: 'Flower',
    image: '/src/assets/images/floral_collection_category_1782537092479.jpg',
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

export const PRODUCTS: Product[] = [
  {
    id: 'white-oud',
    name: { en: 'White Oud Premium Attar', bn: 'হোয়াইট উদ প্রিমিয়াম আতর' },
    category: 'oud',
    price: 450,
    originalPrice: 550,
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.9,
    reviewsCount: 124,
    description: {
      en: 'A bright, sophisticated take on classic Oud. Blends soft woody notes with fresh white musk and rich amber for an ethereal, luxurious aura that lasts over 24 hours.',
      bn: 'ক্লাসিক উদের একটি চমৎকার ও মার্জিত সংস্করণ। এটি মৃদু কাঠের সুবাস, তাজা সাদা কস্তুরী এবং উন্নত আম্বারের এক অপূর্ব মিশ্রণ, যা ২৪ ঘণ্টারও বেশি সময় স্থায়ী সুবাস বজায় রাখে।'
    },
    specifications: {
      en: [
        { label: 'Alcohol Content', value: '100% Alcohol Free' },
        { label: 'Sillage', value: 'Strong Premium Sillage' },
        { label: 'Longevity', value: '24+ Hours (Guaranteed)' },
        { label: 'Volume/Size', value: '3ml / 6ml / 12ml available' },
        { label: 'Origin', value: 'Imported from Saudi Arabia' }
      ],
      bn: [
        { label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' },
        { label: 'ছড়ানো (Sillage)', value: 'অত্যন্ত চমৎকার ও তীব্র' },
        { label: 'স্থায়িত্ব', value: '২৪+ ঘণ্টা (নিশ্চিত)' },
        { label: 'পরিমাণ', value: '৩মি.লি. / ৬মি.লি. / ১২মি.লি.' },
        { label: 'উৎস', value: 'সৌদি আরব থেকে আমদানিকৃত' }
      ]
    },
    benefits: {
      en: [
        '100% non-alcoholic and pure botanical extract.',
        'Soothes the mind and creates a highly spiritual atmosphere.',
        'Comes with a premium luxury glass roll-on bottle.',
        'Stain-free formula, safe for expensive silk or cotton Panjabis.'
      ],
      bn: [
        '১০০% অ্যালকোহল মুক্ত এবং বিশুদ্ধ প্রাকৃতিক নির্যাস।',
        'মনকে শান্ত করে এবং আধ্যাত্মিক আবহ সৃষ্টি করে।',
        'প্রিমিয়াম লাক্সারি কাঁচের রোল-অন বোতলে সরবরাহ করা হয়।',
        'দাগহীন ফর্মুলা, দামী সিল্ক বা সুতি পাঞ্জাবির জন্য সম্পূর্ণ নিরাপদ।'
      ]
    },
    usage: {
      en: 'Apply a small dab to your pulse points: inner wrists, behind ears, and on clean clothes (preferably cotton/linen) for optimal fragrance diffusion.',
      bn: 'হাতের কব্জিতে, কানের পেছনে এবং পরিষ্কার পোশাকে (বিশেষ করে সুতি পোশাকে) আলতো করে রোল-অন ব্যবহার করুন যাতে সুবাস চমৎকারভাবে ছড়িয়ে পড়ে।'
    },
    stock: 45,
    isBestSeller: true,
    isTrending: true,
    isFlashSale: true,
    flashSaleDiscount: 18
  },
  {
    id: 'black-oud',
    name: { en: 'Black Oud Royal Attar', bn: 'ব্ল্যাক উদ রয়্যাল আতর' },
    category: 'oud',
    price: 650,
    originalPrice: 800,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.8,
    reviewsCount: 98,
    description: {
      en: 'Deep, dark, and extraordinarily mysterious. Black Oud is a heavy agarwood-based fragrance, sweetened slightly with sandalwood and patchouli. For those who command respect.',
      bn: 'গভীর, গাঢ় এবং অসাধারণ রহস্যময় সুবাস। ব্ল্যাক উদ হচ্ছে খাঁটি আগরউড ভিত্তিক সুগন্ধি, যা চন্দন ও প্যাচৌলির মৃদু মিষ্টি সুবাস দ্বারা ভারসাম্যপূর্ণ। এটি ব্যক্তিত্বকে করে তোলে আকর্ষণীয়।'
    },
    specifications: {
      en: [
        { label: 'Alcohol Content', value: '100% Alcohol Free' },
        { label: 'Sillage', value: 'Ultra Strong' },
        { label: 'Longevity', value: '36+ Hours' },
        { label: 'Volume/Size', value: '3ml / 6ml / 12ml available' },
        { label: 'Origin', value: 'Imported from Cambodia' }
      ],
      bn: [
        { label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' },
        { label: 'ছড়ানো (Sillage)', value: 'অত্যন্ত তীব্র' },
        { label: 'স্থায়িত্ব', value: '৩৬+ ঘণ্টা' },
        { label: 'পরিমাণ', value: '৩মি.লি. / ৬মি.লি. / ১২মি.লি.' },
        { label: 'উৎস', value: 'কম্বোডিয়া থেকে আমদানিকৃত' }
      ]
    },
    benefits: {
      en: [
        'Pure Cambodian Agarwood base.',
        'Extremely long-lasting scent that stays on clothes even after washing.',
        'Sunnah-compliant fragrance suitable for Friday prayers and daily prayers.',
        'Enhances focus and focus during Dhikr.'
      ],
      bn: [
        'বিশুদ্ধ কম্বোডিয়ান আগরউড বেস।',
        'অত্যন্ত দীর্ঘস্থায়ী সুগন্ধ, যা কাপড় ধোয়ার পরেও অবশিষ্টাংশ ধরে রাখে।',
        'শুক্রবার এবং প্রতিদিনের সালাতের জন্য অত্যন্ত মানানসই সুন্নাহ সুগন্ধি।',
        'যিকর এবং ইবাদতে একাগ্রতা বৃদ্ধি করতে সাহায্য করে।'
      ]
    },
    usage: {
      en: 'Gently rub a drop between palms and pat lightly on clothing and collar areas.',
      bn: 'হাতের তালুতে এক ফোঁটা নিয়ে হালকা ঘষে পোশাকে এবং কলারে আলতো করে মেখে নিন।'
    },
    stock: 22,
    isBestSeller: true,
    isNewArrival: true
  },
  {
    id: 'royal-mirage',
    name: { en: 'Royal Mirage Intense Perfume Oil', bn: 'রয়্যাল মিরাজ ইনটেন্স পারফিউম অয়েল' },
    category: 'arabic',
    price: 380,
    originalPrice: 450,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.7,
    reviewsCount: 85,
    description: {
      en: 'A timeless vintage Arabian blend of classical spices, citrusy top notes, and a comforting base of heavy musk and cedarwood. Ideal for daily office wear and festive gatherings.',
      bn: 'ঐতিহ্যবাহী মশলা, লেবুজাতীয় সতেজতা এবং কস্তুরী ও সিডারউডের এক চিরন্তন ক্লাসিক আরবি মিশ্রণ। দৈনন্দিন অফিস ব্যবহার এবং উৎসবের জন্য দারুণ উপযোগী।'
    },
    specifications: {
      en: [
        { label: 'Alcohol Content', value: '100% Alcohol Free' },
        { label: 'Sillage', value: 'Moderate to Strong' },
        { label: 'Longevity', value: '12-18 Hours' },
        { label: 'Origin', value: 'Imported from UAE' }
      ],
      bn: [
        { label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' },
        { label: 'ছড়ানো (Sillage)', value: 'মধ্যম থেকে তীব্র' },
        { label: 'স্থায়িত্ব', value: '১২-১৮ ঘণ্টা' },
        { label: 'উৎস', value: 'সংযুক্ত আরব আমিরাত (UAE)' }
      ]
    },
    benefits: {
      en: [
        'Classic fresh spicy formulation.',
        'Non-sticky, blends easily on fabrics.',
        'High value for money with incredible longevity.',
        'Sought-after classic Arabic fragrance heritage.'
      ],
      bn: [
        'ক্লাসিক সতেজ মশলাদার ফর্মুলেশন।',
        'আঠালো নয়, কাপড়ের সাথে সহজেই মিশে যায়।',
        'অসাধারণ স্থায়িত্ব এবং সাশ্রয়ী মূল্য।',
        'জনপ্রিয় ঐতিহ্যবাহী আরবি সুগন্ধি।'
      ]
    },
    usage: {
      en: 'Apply behind ears, neck, and on wrists.',
      bn: 'কানের পেছনে, ঘাড়ের অংশে এবং কব্জিতে ব্যবহার করুন।'
    },
    stock: 50,
    isTrending: true
  },
  {
    id: 'open-v2',
    name: { en: 'Open V2 Premium Attar', bn: 'ওপেন ভি২ প্রিমিয়াম আতর' },
    category: 'arabic',
    price: 350,
    originalPrice: 420,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.6,
    reviewsCount: 62,
    description: {
      en: 'A bold, energetic perfume oil combining lavender, tobacco leaf, and lemon, dried down into vetiver and rich leather notes. Extremely sophisticated and masculine.',
      bn: 'ল্যাভেন্ডার, তামাক পাতা এবং লেবুর এক দারুণ সাহসী ও প্রাণবন্ত পারফিউম অয়েল, যার শেষভাগে ভেটিভার এবং লেদারের রাজকীয় সুবাস পাওয়া যায়। অত্যন্ত মার্জিত এবং পুরুষালী।'
    },
    specifications: {
      en: [
        { label: 'Alcohol Content', value: '100% Alcohol Free' },
        { label: 'Sillage', value: 'Strong' },
        { label: 'Longevity', value: '16+ Hours' },
        { label: 'Origin', value: 'Dubai, UAE' }
      ],
      bn: [
        { label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' },
        { label: 'ছড়ানো (Sillage)', value: 'তীব্র' },
        { label: 'স্থায়িত্ব', value: '১৬+ ঘণ্টা' },
        { label: 'উৎস', value: 'দুবাই, আরব আমিরাত' }
      ]
    },
    benefits: {
      en: [
        'Aromatic, bold and masculine.',
        'Excellent for formal occasions and job interviews.',
        'Doesn\'t irritate sensitive skin.',
        'Highly concentrated, just a single application is enough.'
      ],
      bn: [
        'অ্যারোমেটিক, চমৎকার ও পুরুষালী সুবাস।',
        'ফরমাল অনুষ্ঠান ও চাকরির ভাইভার জন্য অত্যন্ত উপযোগী।',
        'সংবেদনশীল ত্বকে কোনো প্রকার ইরিটেশন বা জ্বালাপোড়া করে না।',
        'অত্যন্ত ঘন, মাত্র এক ফোটা ব্যবহারে দীর্ঘসময় সুরভিত রাখে।'
      ]
    },
    usage: {
      en: 'Gently dab on collars, sleeves, and pulse points.',
      bn: 'পাঞ্জাবির কলার, হাতা এবং পালস পয়েন্টে হালকাভাবে প্রয়োগ করুন।'
    },
    stock: 30,
    isNewArrival: true
  },
  {
    id: 'rose-love',
    name: { en: 'Pure Rose Collection Attar', bn: 'বিশুদ্ধ গোলাপ কালেকশন আতর' },
    category: 'floral',
    price: 320,
    originalPrice: 400,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.9,
    reviewsCount: 156,
    description: {
      en: 'A gorgeous, pure extract of freshly plucked Taif Roses. It smells like a dew-kissed rose garden in the early morning. Sweet, soothing, and incredibly floral.',
      bn: 'তাজা তায়েফ গোলাপের এক অপূর্ব ও বিশুদ্ধ নির্যাস। এটি ভোরের শিশিরভেজা গোলাপ বাগানের মতো সুবাস ছড়ায়। মিষ্টি, প্রশান্তিদায়ক এবং অবিশ্বাস্য রকমের সতেজ ফ্লোরাল সুবাস।'
    },
    specifications: {
      en: [
        { label: 'Alcohol Content', value: '100% Alcohol Free' },
        { label: 'Sillage', value: 'Warm & Beautiful' },
        { label: 'Longevity', value: '12-18 Hours' },
        { label: 'Origin', value: 'Imported from Taif, Saudi Arabia' }
      ],
      bn: [
        { label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' },
        { label: 'ছড়ানো (Sillage)', value: 'উষ্ণ ও মনোহর' },
        { label: 'স্থায়িত্ব', value: '১২-১৮ ঘণ্টা' },
        { label: 'উৎস', value: 'তায়েফ, সৌদি আরব' }
      ]
    },
    benefits: {
      en: [
        'Natural distillation of pure Taif Roses.',
        'Induces feelings of relaxation and joy.',
        'Loved by both men and women.',
        'Excellent Sunnah gift for weddings and family gatherings.'
      ],
      bn: [
        'খাঁটি তায়েফ গোলাপের প্রাকৃতিক বাষ্পীয় পাতন পদ্ধতিতে প্রস্তুত।',
        'মনকে প্রফুল্ল ও মানসিক চাপমুক্ত রাখতে সাহায্য করে।',
        'নারী-পুরুষ সকলেরই অত্যন্ত পছন্দের সুবাস।',
        'বিয়ে বা ধর্মীয় অনুষ্ঠানের জন্য একটি উৎকৃষ্ট সুন্নাহ উপহার।'
      ]
    },
    usage: {
      en: 'Apply to pulse points or mix a tiny drop with unscented body lotion.',
      bn: 'হাতের কব্জিতে ব্যবহার করুন অথবা যেকোনো সুবাসহীন লোশনের সাথে এক ফোঁটা মিশিয়ে ব্যবহার করতে পারেন।'
    },
    stock: 55,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleDiscount: 20
  },
  {
    id: 'jasmine-royal',
    name: { en: 'Royal Jasmine Perfume Oil', bn: 'রয়্যাল জেসমিন পারফিউম অয়েল' },
    category: 'floral',
    price: 280,
    originalPrice: 350,
    images: [
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.5,
    reviewsCount: 47,
    description: {
      en: 'The sweet, intoxicating aroma of night-blooming Jasmine flowers. Captures the absolute purity of white blossoms. Very calming and long-lasting.',
      bn: 'রাত্রিকালীন প্রস্ফুটিত বেলি ফুলের মিষ্টি ও চমৎকার সুবাস। সাদা ফুলের অপরূপ শুভ্রতা ও পবিত্রতা বহন করে। এটি মনকে প্রশান্ত করে ও ক্লান্তি দূর করে।'
    },
    specifications: {
      en: [
        { label: 'Alcohol Content', value: '100% Alcohol Free' },
        { label: 'Sillage', value: 'Sweet and Wide' },
        { label: 'Longevity', value: '10-14 Hours' },
        { label: 'Origin', value: 'Imported from India' }
      ],
      bn: [
        { label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' },
        { label: 'ছড়ানো (Sillage)', value: 'মিষ্টি ও সুদূরপ্রসারী' },
        { label: 'স্থায়িত্ব', value: '১০-১৪ ঘণ্টা' },
        { label: 'উৎস', value: 'ভারত' }
      ]
    },
    benefits: {
      en: [
        'Pure, high-grade white flower extraction.',
        'Rich, romantic, and highly calming aromatherapy properties.',
        'Stain-free on clean fabrics.',
        'Perfect for night use and special events.'
      ],
      bn: [
        'খাঁটি ও উচ্চমানের সাদা বেলি ফুলের নির্যাস।',
        'অ্যারোমাথেরাপি গুণাগুণ সমৃদ্ধ, যা মানসিক প্রশান্তি আনে।',
        'পরিষ্কার কাপড়ে কোনো দাগ ফেলে না।',
        'রাতের ব্যবহার এবং বিশেষ উৎসবের জন্য চমৎকার।'
      ]
    },
    usage: {
      en: 'Apply lightly behind the ears and on wrists.',
      bn: 'কানের পেছনের অংশে এবং দুই হাতের কব্জিতে আলতোভাবে লাগান।'
    },
    stock: 40,
    isTrending: true
  },
  {
    id: 'rajanigandha-gold',
    name: { en: 'Rajanigandha Gold Attar', bn: 'রজনীগন্ধা গোল্ড আতর' },
    category: 'floral',
    price: 300,
    originalPrice: 380,
    images: [
      'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.8,
    reviewsCount: 72,
    description: {
      en: 'Rich, creamy and incredibly heavy fragrance of pure Tuberose (Rajanigandha) flowers. An intense scent that fills the room immediately upon application.',
      bn: 'বিশুদ্ধ রজনীগন্ধা ফুলের অত্যন্ত মিষ্টি, ঘন ও আকর্ষণীয় সুবাস। এটি একটি অত্যন্ত তীব্র সুগন্ধি যা ব্যবহারের সাথে সাথেই চারপাশ সুরভিত করে তোলে।'
    },
    specifications: {
      en: [
        { label: 'Alcohol Content', value: '100% Alcohol Free' },
        { label: 'Sillage', value: 'Very Strong' },
        { label: 'Longevity', value: '18+ Hours' },
        { label: 'Origin', value: 'Imported from India' }
      ],
      bn: [
        { label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' },
        { label: 'ছড়ানো (Sillage)', value: 'অত্যন্ত তীব্র' },
        { label: 'স্থায়িত্ব', value: '১৮+ ঘণ্টা' },
        { label: 'উৎস', value: 'ভারত' }
      ]
    },
    benefits: {
      en: [
        'Captures the exact fragrance of freshly picked Rajanigandha stalks.',
        'Evokes nostalgic vibes and joyful celebrations.',
        'Extremely long lasting with robust sillage.',
        '100% pure premium essential oil.'
      ],
      bn: [
        'তাজা রজনীগন্ধা ফুলের প্রকৃত সুবাস হুবহু ফুটিয়ে তোলে।',
        'মনকে উৎফুল্ল করে এবং উৎসবে সতেজ অনুভূতি দেয়।',
        'দীর্ঘস্থায়ী সুবাস ও চমৎকার সillage।',
        '১০০% বিশুদ্ধ প্রিমিয়াম এসেনশিয়াল অয়েল।'
      ]
    },
    usage: {
      en: 'Dab onto pulse points, rubbing gently.',
      bn: 'পালস পয়েন্টগুলোতে আলতো করে ঘষে মেখে নিন।'
    },
    stock: 25,
    isNewArrival: true
  },
  {
    id: 'cool-water',
    name: { en: 'Cool Water Oceanic Attar', bn: 'কুল ওয়াটার ওশেনিক আতর' },
    category: 'fresh',
    price: 290,
    originalPrice: 360,
    images: [
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.8,
    reviewsCount: 112,
    description: {
      en: 'Our absolute best-selling summer scent. Waves of oceanic freshness combined with peppermint, lavender, coriander, oakmoss, and sandalwood. Incredibly cooling and rejuvenating.',
      bn: 'গ্রীষ্মের জন্য আমাদের সবচেয়ে সেরা বিক্রীত সুবাস। সমুদ্রের হিমেল সতেজতার সাথে পুদিনা পাতা, ল্যাভেন্ডার, ধনেপাতা এবং চন্দনের এক অপূর্ব ঠাণ্ডা অনুভূতিদায়ক মিশ্রণ।'
    },
    specifications: {
      en: [
        { label: 'Alcohol Content', value: '100% Alcohol Free' },
        { label: 'Sillage', value: 'Moderate Fresh' },
        { label: 'Longevity', value: '12+ Hours' },
        { label: 'Origin', value: 'Imported from France' }
      ],
      bn: [
        { label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' },
        { label: 'ছড়ানো (Sillage)', value: 'সতেজ ও চমৎকার' },
        { label: 'স্থায়িত্ব', value: '১২+ ঘণ্টা' },
        { label: 'উৎস', value: 'ফ্রান্স' }
      ]
    },
    benefits: {
      en: [
        'Provides an instant cooling sensation in hot humid weather.',
        'Smells modern, sporty, and highly clean.',
        'Extremely popular among college students and young professionals.',
        'Stain-free on cotton/polyester shirts.'
      ],
      bn: [
        'গরম ও আর্দ্র আবহাওয়ায় তাৎক্ষণিক শীতল ও সতেজ অনুভূতি দেয়।',
        'অত্যন্ত আধুনিক, স্পোর্টি এবং চমৎকার সতেজ সুবাস।',
        'তরুণ ও পেশাজীবীদের মাঝে অত্যন্ত জনপ্রিয়।',
        'সুতি এবং সিন্থেটিক কাপড়ে কোনো প্রকার দাগ ফেলে না।'
      ]
    },
    usage: {
      en: 'Apply generously to clothing after a shower for an all-day fresh sea-breeze aura.',
      bn: 'গোসলের পর পরিষ্কার পোশাকে ব্যবহার করুন যাতে সারা দিন সমুদ্রের সতেজ অনুভব পাওয়া যায়।'
    },
    stock: 60,
    isBestSeller: true,
    isTrending: true,
    isFlashSale: true,
    flashSaleDiscount: 24
  },
  {
    id: 'polo-sport',
    name: { en: 'Polo Sport Active Attar', bn: 'পোলো স্পোর্ট অ্যাক্টিভ আতর' },
    category: 'fresh',
    price: 340,
    originalPrice: 420,
    images: [
      'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.6,
    reviewsCount: 54,
    description: {
      en: 'An energetic fragrance designed for the athletic individual. Opens with mandarin, lemon, and neroli, fading into pine, jasmine, amber, and musk. Keeps sweat odor at bay.',
      bn: 'অ্যাথলেটিক ও ক্রীড়াপ্রেমী মানুষদের জন্য ডিজাইন করা একটি দারুণ এনার্জেটিক আতর। মাল্টা, লেবু এবং পাইন গাছের চমৎকার সতেজতার সুবাস ঘামের দুর্গন্ধ দূর করে।'
    },
    specifications: {
      en: [
        { label: 'Alcohol Content', value: '100% Alcohol Free' },
        { label: 'Sillage', value: 'Strong Active Sillage' },
        { label: 'Longevity', value: '14+ Hours' },
        { label: 'Origin', value: 'Imported from UK' }
      ],
      bn: [
        { label: 'অ্যালকোহল', value: '১০০% অ্যালকোহল মুক্ত' },
        { label: 'ছড়ানো (Sillage)', value: 'তীব্র ও সক্রিয়' },
        { label: 'স্থায়িত্ব', value: '১৪+ ঘণ্টা' },
        { label: 'উৎস', value: 'যুক্তরাজ্য (UK)' }
      ]
    },
    benefits: {
      en: [
        'Combats body odor actively under the sun.',
        'Fresh citrus and pine woody formulation.',
        'High projection suitable for sports and outdoor wear.',
        'Very refreshing skin feel.'
      ],
      bn: [
        'রোদের মধ্যে গায়ের ঘামের দুর্গন্ধের বিরুদ্ধে দারুণ কাজ করে।',
        'তাজা সাইট্রাস এবং পাইন কাঠের চমৎকার সুবাস।',
        'খেলাধুলা এবং আউটডোর ব্যবহারের জন্য উপযোগী উচ্চ প্রজেকশন।',
        'ত্বকে চমৎকার সতেজ অনুভূতি দেয়।'
      ]
    },
    usage: {
      en: 'Apply to undershirts, cuffs, and behind neck before outdoor activities.',
      bn: 'বাইরে যাওয়ার পূর্বে আন্ডারশার্ট, হাতা এবং ঘাড়ের অংশে মেখে নিন।'
    },
    stock: 35
  },
  {
    id: 'kalojira-seed',
    name: { en: 'Organic Kalojira (Premium Black Seed)', bn: 'অর্গানিক কালোজিরা (প্রিমিয়াম বাছাইকৃত)' },
    category: 'natural',
    price: 180,
    originalPrice: 220,
    images: [
      'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.9,
    reviewsCount: 184,
    description: {
      en: 'Double-cleaned, high-potency premium black seeds (Nigella Sativa) sourced from organic farms. A miraculous prophetic cure (Sunnah) for everyday health and immune boost.',
      bn: 'অর্গানিক খামার থেকে সংগৃহীত, ডাবল ফিল্টার করা অত্যন্ত পুষ্টিগুণ সম্পন্ন প্রিমিয়াম কালোজিরা। এটি রোগ প্রতিরোধ ক্ষমতা বাড়াতে অত্যন্ত কার্যকরী একটি সুন্নাহ খাবার।'
    },
    specifications: {
      en: [
        { label: 'Purity', value: '100% Pure & Organic' },
        { label: 'Grade', value: 'Double Filtered Export Quality' },
        { label: 'Weight', value: '250g / 500g packets' },
        { label: 'Packaging', value: 'Food-grade Zipper Stand-up Pouch' }
      ],
      bn: [
        { label: 'বিশুদ্ধতা', value: '১০০% খাঁটি ও অর্গানিক' },
        { label: 'মান', value: 'রপ্তানিযোগ্য সেরা গ্রেড' },
        { label: 'ওজন', value: '২৫০ গ্রাম / ৫০০ গ্রাম' },
        { label: 'প্যাকেজিং', value: 'ফুড-গ্রেড জিপার লক পাউচ' }
      ]
    },
    benefits: {
      en: [
        'Prophetic medicine (Sunnah) declared as a cure for all diseases except death.',
        'Boosts immunity, lungs health, and brain functions.',
        '100% organic, pesticide-free, double cleaned.',
        'Rich in antioxidants and active thymoquinone.'
      ],
      bn: [
        'রাসূল (সাঃ)-এর সুন্নাহ ওষুধ, যা মৃত্যু ব্যতীত সকল রোগের নিরাময়কারী হিসেবে বর্ণিত।',
        'রোগ প্রতিরোধ ক্ষমতা, ফুসফুসের কর্মক্ষমতা এবং মস্তিষ্কের ক্ষমতা বৃদ্ধি করে।',
        '১০০% অর্গানিক, কীটনাশক মুক্ত এবং ধূলিকণাহীন পরিষ্কার।',
        'অ্যান্টিঅক্সিডেন্ট এবং থাইমোকুইনোন সমৃদ্ধ।'
      ]
    },
    usage: {
      en: 'Consume half a teaspoon of black seeds daily with raw honey on an empty stomach, or sprinkle on bread, salads, and curries.',
      bn: 'প্রতিদিন সকালে খালি পেটে আধা চামচ কালোজিরা মধুর সাথে চিবিয়ে খাবেন, অথবা তরকারি ও পিঠার ওপরে ছড়িয়ে খেতে পারেন।'
    },
    stock: 120,
    isBestSeller: true
  },
  {
    id: 'black-seed-oil',
    name: { en: 'Cold-Pressed Premium Black Seed Oil', bn: 'কোল্ড-প্রেসড প্রিমিয়াম কালোজিরা তেল' },
    category: 'natural',
    price: 350,
    originalPrice: 420,
    images: [
      'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.8,
    reviewsCount: 142,
    description: {
      en: '100% pure cold-pressed oil from premium black seeds. No chemical extraction, no additives. Retains all natural nutrients and active compounds for maximum health benefits.',
      bn: 'প্রিমিয়াম কালোজিরা থেকে ঘানিতে ভাঙা কোল্ড-প্রেসড তেল। কোনো রাসায়নিক মিশ্রণ বা প্রিজারভেটিভ নেই। তেলের সর্বোচ্চ কার্যকারিতার জন্য প্রাকৃতিক পুষ্টি বজায় রাখা হয়েছে।'
    },
    specifications: {
      en: [
        { label: 'Extraction', value: 'Cold Pressed ( কাঠের ঘানি )' },
        { label: 'Purity', value: '100% Natural Oil' },
        { label: 'Volume', value: '100ml / 200ml glass bottle' },
        { label: 'Additives', value: 'Hexane & Solvent Free' }
      ],
      bn: [
        { label: 'উৎপাদন প্রণালী', value: 'কোল্ড প্রেসড ( কাঠের ঘানি )' },
        { label: 'বিশুদ্ধতা', value: '১০০% প্রাকৃতিক খাঁটি তেল' },
        { label: 'পরিমাণ', value: '১০০ মি.লি. / ২০০ মি.লি.' },
        { label: 'মিশ্রণ', value: 'সম্পূর্ণ কেমিক্যাল ও প্রিজারভেটিভ মুক্ত' }
      ]
    },
    benefits: {
      en: [
        'Promotes hair growth and prevents dandruff when applied to the scalp.',
        'Helps manage respiratory systems and asthma when consumed or inhaled.',
        'Soothes joint pain and arthritis when massaged gently on affected areas.',
        'Regulates blood pressure and digestive health.'
      ],
      bn: [
        'চুলের গোড়ায় ব্যবহারে চুল পড়া বন্ধ হয় এবং নতুন চুল গজাতে সাহায্য করে।',
        'শ্বাসকষ্ট ও অ্যাজমার তীব্রতা কমাতে অত্যন্ত সাহায্য করে।',
        'গেঁটে বাত এবং যেকোনো ব্যথার জায়গায় ম্যাসাজ করলে উপশম হয়।',
        'রক্তচাপ নিয়ন্ত্রণ ও পরিপাকতন্ত্রকে সুস্থ রাখে।'
      ]
    },
    usage: {
      en: 'For hair: Massage directly on scalp and leave for 2 hours before wash. For consumption: Take 1 teaspoon daily mixed with honey or warm milk.',
      bn: 'চুলের জন্য: মাথায় সরাসরি ম্যাসাজ করুন এবং ধোয়ার ২ ঘণ্টা আগে রাখুন। খাওয়ার জন্য: প্রতিদিন ১ চা চামচ করে মধু বা কুসুম গরম দুধে মিশিয়ে পান করুন।'
    },
    stock: 80,
    isTrending: true
  },
  {
    id: 'prophetic-honey',
    name: { en: 'Raw Khalisa Mustard Flower Honey', bn: 'খাঁটি খলিশা ফুল ও সরিষা ফুলের মধু' },
    category: 'natural',
    price: 480,
    originalPrice: 600,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.9,
    reviewsCount: 210,
    description: {
      en: '100% raw, unfiltered honey collected directly from pristine mustard and khalisha flower fields of Bangladesh. Rich golden color with a heavenly natural floral sweet flavor.',
      bn: 'সরাসরি খামারিদের থেকে সংগৃহীত শতভাগ খাঁটি ও অপরিশোধিত খলিশা ও সরিষা ফুলের মধু। চমৎকার সোনালী রঙের এই মধু স্বাদে অত্যন্ত মিষ্টি এবং প্রাকৃতিক ঔষধি গুণসম্পন্ন।'
    },
    specifications: {
      en: [
        { label: 'Purity', value: '100% Unpasteurized & Raw' },
        { label: 'Lab Checked', value: 'Sucrose below 5% (Guaranteed)' },
        { label: 'Weight', value: '500g / 1kg glass jar' },
        { label: 'Origin', value: 'Sundarbans & North Bengal, Bangladesh' }
      ],
      bn: [
        { label: 'বিশুদ্ধতা', value: '১০০% অপরিশোধিত খাঁটি মধু' },
        { label: 'ল্যাব টেস্ট', value: 'সুক্রোজ ৫% এর নিচে (নিশ্চিত)' },
        { label: 'ওজন', value: '৫০০ গ্রাম / ১ কেজি' },
        { label: 'উৎস', value: 'সুন্দরবন ও উত্তরবঙ্গ, বাংলাদেশ' }
      ]
    },
    benefits: {
      en: [
        'An excellent natural replacement for white table sugar.',
        'Soothes throat irritation, dry cough and builds strong stamina.',
        'Contains rich enzymes and vitamins for natural digestive health.',
        'Sunnah-friendly food item used as complete healing.'
      ],
      bn: [
        'চিনি বা কৃত্রিম মিষ্টির একটি চমৎকার প্রাকৃতিক বিকল্প।',
        'গলা ব্যথা, সর্দি-কাশি ও বুক ধড়ফড় করা কমাতে জাদুর মতো কাজ করে।',
        'হজম শক্তি বৃদ্ধি করে এবং শারীরিক দুর্বলতা নিমেষেই দূর করে।',
        'রাসূল (সাঃ)-এর অন্যতম প্রিয় খাবার, যাতে রয়েছে দৈহিক নিরাময়।'
      ]
    },
    usage: {
      en: 'Mix 1-2 tablespoons with warm water and fresh lemon juice every morning, or use as a delicious topping on pancakes and traditional sweets.',
      bn: 'প্রতিদিন সকালে কুসুম গরম পানিতে ১-২ চামচ মধু ও লেবুর রস মিশিয়ে খালি পেটে পান করুন, অথবা রুটি ও পিঠার সাথে মেখে খেতে পারেন।'
    },
    stock: 90,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleDiscount: 20
  },
  {
    id: 'luxury-gift-box',
    name: { en: 'Mifta Royal Sunnah Gift Box', bn: 'মিফতা রয়্যাল সুন্নাহ গিফট বক্স' },
    category: 'gifts',
    price: 1500,
    originalPrice: 1850,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 5.0,
    reviewsCount: 38,
    description: {
      en: 'An ultra-premium wooden carved gift chest. Includes three premium 6ml Attars (White Oud, Taif Rose, Cool Water), one premium tasbih, a premium Sunnah miswak, and a bottle of raw honey.',
      bn: 'একটি রাজকীয় কাঠের খোদাই করা চমৎকার সুন্নাহ গিফট বক্স। এতে রয়েছে ৩টি প্রিমিয়াম ৬মি.লি. আতর (হোয়াইট উদ, তায়েফ রোজ ও কুল ওয়াটার), একটি রাজকীয় তাসবিহ, একটি স্পেশাল সুন্নাহ মেসওয়াক এবং এক বোতল খাঁটি মধু।'
    },
    specifications: {
      en: [
        { label: 'Package Contents', value: '3x Premium Attars (6ml), 1x Royal Tasbih, 1x Organic Miswak, 1x Honey Jar (150g)' },
        { label: 'Box Material', value: 'Premium Carved Rosewood with Velvet Cushion' },
        { label: 'Dimension', value: '10 x 8 x 4 inches' },
        { label: 'Customization', value: 'Free hand-written gift message' }
      ],
      bn: [
        { label: 'প্যাকেজের উপাদান', value: '৩টি প্রিমিয়াম আতর (৬মি.লি.), ১টি রয়্যাল তাসবিহ, ১টি স্পেশাল মেসওয়াক, ১টি মধু জার (১৫০ গ্রাম)' },
        { label: 'বক্সের উপাদান', value: 'মখমলের কুশন যুক্ত খোদাই করা কাঠের প্রিমিয়াম বাক্স' },
        { label: 'সাইজ', value: '১০ x ৮ x ৪ ইঞ্চি' },
        { label: 'কাস্টমাইজেশন', value: 'ফ্রি হাতে লেখা শুভেচ্ছা চিরকুট' }
      ]
    },
    benefits: {
      en: [
        'The absolute perfect gift for Eids, Hajj returnees, weddings, or corporate events.',
        'Upholds Sunnah values in a luxurious, elegant appearance.',
        'Saves more than 20% compared to buying items individually.',
        'Creates an everlasting memory of love and religious bonding.'
      ],
      bn: [
        'ঈদ, বিয়ে, হজ থেকে ফিরে আসা হাজী সাহেব বা কর্পোরেট অনুষ্ঠানের জন্য একটি সেরা উপহার।',
        'চমৎকার রাজকীয় মোড়কে সুন্নাহ মূল্যবোধের বহিঃপ্রকাশ ঘটায়।',
        'আলাদা কেনার তুলনায় ২০% এর বেশি সাশ্রয়ী।',
        'পারস্পরিক ভালোবাসা ও ধর্মীয় মেলবন্ধনকে আরো দৃঢ় করে।'
      ]
    },
    usage: {
      en: 'Present it to your parents, spouse, or business partners. Safe to store at room temperature.',
      bn: 'বাবা-মা, জীবনসঙ্গী অথবা ব্যবসার অংশীদারদের উপহার দিন। সাধারণ তাপমাত্রায় সংরক্ষণ করতে পারবেন।'
    },
    stock: 15,
    isBestSeller: true,
    isTrending: true
  }
];

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
