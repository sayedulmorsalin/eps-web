'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'bn' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    brand_name: 'EPSR Grocery',
    brand_subtitle: 'Easy Product Service Rajshahi (রাজশাহীর অনলাইন গ্রোসারি সুপারশপ)',
    tagline: 'রাজশাহীর সেরা অনলাইন গ্রোসারি শপ — তাজা শাকসবজি, চাল-ডাল, তেল-মসলা, ডিম-দুধ ও নিত্যপ্রয়োজনীয় মুদি বাজার সরাসরি আপনার দোরগোড়ায়',
    search_placeholder: 'চাল, ডাল, তেল, ডিম, আলু, পেঁয়াজ বা গ্রোসারি পণ্য খুঁজুন...',
    all_categories: 'সকল গ্রোসারি ক্যাটাগরি',
    cart: 'বাজারের ব্যাগ',
    login: 'লগইন',
    register: 'রেজিস্টার',
    logout: 'লগআউট',
    my_orders: 'আমার অর্ডার',
    popular_categories: 'জনপ্রিয় গ্রোসারি বিভাগ',
    daily_best_sells: 'নিত্যপ্রয়োজনীয় সেরা গ্রোসারি পণ্য',
    add_to_cart: 'ব্যাগে রাখুন',
    in_stock: 'মজুদ আছে',
    out_of_stock: 'স্টক শেষ',
    bdt: '৳',
    delivery_guarantee: 'রাজশাহী শহরে ৬০ মিনিটে দ্রুত গ্রোসারি ডেলিভারি',
    best_price: '১০০% তাজা ও খাঁটি পণ্যের সেরা দাম',
    cash_on_delivery: 'পণ্য হাতে পেয়ে মূল্য পরিশোধ (ক্যাশ অন ডেলিভারি)',
    order_summary: 'অর্ডারের বিবরণ',
    subtotal: 'উপমোট (Subtotal)',
    delivery_fee: 'ডেলিভারি চার্জ',
    discount: 'ডিসকাউন্ট',
    total: 'সর্বমোট প্রদেয়',
    checkout: 'অর্ডার সম্পন্ন করুন',
    promo_code: 'কুপন কোড',
    apply: 'প্রয়োগ',
    delivery_address: 'আপনার সম্পূর্ণ ডেলিভারি ঠিকানা',
    delivery_notes: 'ডেলিভারি সংক্রান্ত নির্দেশনা (ঐচ্ছিক)',
    place_order: 'অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি)',
    track_order: 'অর্ডার ট্র্যাকিং',
    order_status: 'অর্ডার স্ট্যাটাস',
    order_placed: 'অর্ডার গৃহীত হয়েছে',
    preparing: 'প্যাকেজিং হচ্ছে',
    assigned_to_rider: 'ডেলিভারি পার্টনার প্রস্তুত',
    picked_up: 'ডেলিভারির উদ্দেশ্যে রওয়ানা',
    on_the_way: 'আপনার ঠিকানার পথে',
    delivered: 'সফলভাবে ডেলিভারি সম্পন্ন',
    rider_info: 'ডেলিভারি রাইডারের তথ্য',
    call_rider: 'কল করুন',
    order_id: 'অর্ডার আইডি',
    hotline: '০১৭০০-০০০০০০',
    call_to_order: 'অর্ডার করতে কল করুন',
  },
  en: {
    brand_name: 'EPSR Grocery',
    brand_subtitle: 'Easy Product Service Rajshahi - Online Grocery Superstore',
    tagline: 'Easy Product Service Rajshahi - Fresh vegetables, rice, lentils, edible oils, eggs, milk and daily groceries delivered to your home within 60 minutes across Rajshahi.',
    search_placeholder: 'Search rice, dal, edible oil, eggs, potato, onion, milk...',
    all_categories: 'All Grocery Categories',
    cart: 'Grocery Bag',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    my_orders: 'My Orders',
    popular_categories: 'Popular Grocery Aisles',
    daily_best_sells: 'Essential Daily Groceries',
    add_to_cart: 'Add to Bag',
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    bdt: '৳',
    delivery_guarantee: 'Express 60-Min Grocery Delivery in Rajshahi',
    best_price: '100% Fresh & Authentic Grocery Promise',
    cash_on_delivery: 'Pay Cash on Delivery (COD)',
    order_summary: 'Order Summary',
    subtotal: 'Subtotal',
    delivery_fee: 'Delivery Fee',
    discount: 'Discount',
    total: 'Total Payable',
    checkout: 'Proceed to Checkout',
    promo_code: 'Coupon Code',
    apply: 'Apply',
    delivery_address: 'Full Delivery Address',
    delivery_notes: 'Delivery Instructions (optional)',
    place_order: 'Confirm Order (Cash on Delivery)',
    track_order: 'Track Order',
    order_status: 'Order Status',
    order_placed: 'Order Received',
    preparing: 'Packaging In Progress',
    assigned_to_rider: 'Rider Assigned',
    picked_up: 'Dispatched',
    on_the_way: 'On The Way',
    delivered: 'Delivered',
    rider_info: 'Rider Details',
    call_rider: 'Call Rider',
    order_id: 'Order ID',
    hotline: '+880 1700-000000',
    call_to_order: 'Call to Order',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'bn',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('bn');

  useEffect(() => {
    const saved = localStorage.getItem('epsr_lang') as Language;
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('epsr_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
