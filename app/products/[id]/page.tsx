'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getSupabaseClient } from '../../../lib/supabase/client';
import { trackProductView } from '../../../lib/analytics';
import { Product } from '../../../components/ProductCard';
import {
  getCachedProductById,
  getInMemoryProductById,
  mapProductRow,
  PRODUCT_DETAIL_COLUMNS,
  seedCatalogProducts,
  shouldOptimizeImage,
  type SupabaseProductRow,
} from '../../../lib/catalog';

const MOCK_PRODUCTS: Record<string, Product> = {
  gb1: {
    id: 'gb1',
    vendorId: 'v1',
    categoryId: '1',
    nameEn: 'Fresh Potato (গোল আলু)',
    nameBn: 'তাজা গোল আলু (১ কেজি)',
    descriptionEn: 'Fresh quality local farm round potatoes, clean and medium size.',
    descriptionBn: 'রাজশাহীর স্থানীয় খামারের বাছাইকৃত পরিষ্কার ও পুষ্টিকর গোল আলু।',
    price: 35,
    discountedPrice: 30,
    stockCount: 500,
    unit: '১ কেজি (1 kg)',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    avgRating: 4.9,
    reviewCount: 120,
  },
  gb2: {
    id: 'gb2',
    vendorId: 'v1',
    categoryId: '1',
    nameEn: 'Local Red Onion (দেশি পেঁয়াজ)',
    nameBn: 'দেশি লাল পেঁয়াজ (১ কেজি)',
    descriptionEn: 'Handpicked superior quality Bangladeshi red onions.',
    descriptionBn: 'ঝাঁঝালো ও তাজা বাছাইকৃত দেশি লাল পেঁয়াজ। রান্নায় দেবে দারুণ স্বাদ।',
    price: 65,
    discountedPrice: 60,
    stockCount: 400,
    unit: '১ কেজি (1 kg)',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    avgRating: 4.8,
    reviewCount: 95,
  },
  gb3: {
    id: 'gb3',
    vendorId: 'v1',
    categoryId: '2',
    nameEn: 'Premium Miniket Rice (মিনিকেট চাল ৫ কেজি)',
    nameBn: 'প্রিমিয়াম মিনিকেট চাল (৫ কেজি ব্যাগ)',
    descriptionEn: '5kg pack of premium white slender polished Miniket rice.',
    descriptionBn: 'ঝরঝরে, সরু ও পরিষ্কার প্রিমিয়াম কোয়ালিটি মিনিকেট চাল ৫ কেজি বস্তা।',
    price: 370,
    discountedPrice: 350,
    stockCount: 250,
    unit: '৫ কেজি ব্যাগ',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    avgRating: 5.0,
    reviewCount: 180,
  },
  gb4: {
    id: 'gb4',
    vendorId: 'v1',
    categoryId: '2',
    nameEn: 'Deshi Masoor Dal (দেশি মসুর ডাল ১ কেজি)',
    nameBn: 'দেশি মসুর ডাল (১ কেজি)',
    descriptionEn: 'Clean, polished high protein local Masoor lentils.',
    descriptionBn: '১০০% পরিষ্কার, দানাদার ও দ্রুত সেদ্ধ হওয়া দেশি মসুর ডাল।',
    price: 140,
    discountedPrice: 130,
    stockCount: 300,
    unit: '১ কেজি (1 kg)',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    avgRating: 4.9,
    reviewCount: 88,
  },
  gb5: {
    id: 'gb5',
    vendorId: 'v1',
    categoryId: '3',
    nameEn: 'Rupchanda Fortified Soybean Oil (৫ লিটার)',
    nameBn: 'রূপচাঁদা ভিটামিন সমৃদ্ধ সয়াবিন তেল (৫ লিটার)',
    descriptionEn: 'Fortified with Vitamin A & D, heart-friendly pure refined soybean oil.',
    descriptionBn: 'ভিটামিন এ ও ডি সমৃদ্ধ দেশের এক নম্বর বিশুদ্ধ ভোজ্য সয়াবিন তেল ৫ লিটার বোতল।',
    price: 890,
    discountedPrice: 860,
    stockCount: 180,
    unit: '৫ লিটার বোতল',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    avgRating: 5.0,
    reviewCount: 240,
  },
  gb6: {
    id: 'gb6',
    vendorId: 'v1',
    categoryId: '4',
    nameEn: 'Farm Fresh Brown Eggs (ফার্মের লাল ডিম ১ ডজন)',
    nameBn: 'ফার্মের ফ্রেশ লাল ডিম (১ ডজন - ১২টি)',
    descriptionEn: '12-piece pack of fresh, protein-rich brown chicken eggs.',
    descriptionBn: 'প্রতিদিন সকালে সরাসরি খামার থেকে সংগৃহীত তাজা ফার্মের লাল ডিম।',
    price: 155,
    discountedPrice: 145,
    stockCount: 400,
    unit: '১ ডজন (১২টি)',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
    avgRating: 4.9,
    reviewCount: 210,
  },
  gb7: {
    id: 'gb7',
    vendorId: 'v1',
    categoryId: '4',
    nameEn: 'Milk Vita Pasteurized Milk (১ লিটার)',
    nameBn: 'মিল্ক ভিটা পাস্তুরিত তরল দুধ (১ লিটার)',
    descriptionEn: '100% pure pasteurized wholesome full cream cow milk.',
    descriptionBn: 'খাঁটি ও পুষ্টিকর তরল দুধ, স্বাস্থ্যকর পাস্তুরিত প্যাকেটজাত দুধ।',
    price: 90,
    discountedPrice: 90,
    stockCount: 150,
    unit: '১ লিটার প্যাকেট',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    avgRating: 4.9,
    reviewCount: 130,
  },
  gb8: {
    id: 'gb8',
    vendorId: 'v1',
    categoryId: '5',
    nameEn: 'Fresh Broiler Chicken (তাজা ব্রয়লার মুরগি ১ কেজি)',
    nameBn: 'তাজা ব্রয়লার মুরগি ড্রেসিং সহ (১ কেজি)',
    descriptionEn: 'Freshly cut, washed and hygienic broiler chicken meat.',
    descriptionBn: 'অর্ডারের পর জীবন্ত স্বাস্থ্যবান মুরগি ড্রেসিং ও পরিষ্কার করে তাজা সরবরাহ।',
    price: 210,
    discountedPrice: 195,
    stockCount: 100,
    unit: '১ কেজি (1 kg)',
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    avgRating: 4.8,
    reviewCount: 78,
  },
};

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { addItem } = useCart();
  const { language } = useLanguage();

  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const instantProduct = id ? getInMemoryProductById(id) : null;
  const product = fetchedProduct ?? instantProduct;
  const loading = Boolean(id) && loadedId !== id && !product;
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    const loadProduct = async () => {
      await Promise.resolve();
      const cached = getCachedProductById(id);
      if (active && cached) {
        setFetchedProduct((prev) => prev ?? cached);
      }

      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('products')
          .select(PRODUCT_DETAIL_COLUMNS)
          .eq('id', id)
          .maybeSingle();

        if (!active) return;
        if (!error && data) {
          const mapped = mapProductRow(data as SupabaseProductRow);
          seedCatalogProducts([mapped], `detail:${id}`);
          trackProductView({
            id: mapped.id,
            nameBn: mapped.nameBn,
            nameEn: mapped.nameEn,
            price: mapped.price,
            categoryId: mapped.categoryId,
          });
          setFetchedProduct(mapped);
        } else if (MOCK_PRODUCTS[id]) {
          setFetchedProduct(MOCK_PRODUCTS[id]);
        } else if (!cached) {
          setFetchedProduct({
            id,
            vendorId: 'v1',
            categoryId: '1',
            nameEn: 'Organic Grocery Item',
            nameBn: 'খাঁটি প্রাকৃতিক খাদ্যপণ্য',
            descriptionEn: 'Premium quality organic food product carefully sourced and packaged for freshness.',
            descriptionBn: '১০০% বিশুদ্ধ ও নিরাপদ প্রাকৃতিক খাদ্যপণ্য, সরাসরি খামার থেকে সংগৃহীত।',
            price: 550,
            discountedPrice: 490,
            stockCount: 50,
            unit: '১ প্যাক (1 Pack)',
            avgRating: 4.9,
            reviewCount: 35,
          });
        }
      } catch {
        if (active && MOCK_PRODUCTS[id]) {
          setFetchedProduct(MOCK_PRODUCTS[id]);
        }
      } finally {
        if (active) setLoadedId(id);
      }
    };

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl">🌾</span>
        <h2 className="text-2xl font-black text-[#221E1F] mt-4">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
        <p className="text-gray-500 text-sm mt-2">Product could not be found or has been removed.</p>
        <Link
          href="/products"
          className="inline-block mt-6 px-6 py-3 bg-[#F48721] text-white font-bold rounded-full text-sm hover:bg-[#e07515] transition"
        >
          সকল পণ্য দেখুন
        </Link>
      </div>
    );
  }

  const name = language === 'bn' ? product.nameBn : product.nameEn;
  const desc = language === 'bn' ? (product.descriptionBn || product.descriptionEn) : (product.descriptionEn || product.descriptionBn);
  const hasDiscount = product.discountedPrice && Number(product.discountedPrice) < Number(product.price);
  const currentPrice = hasDiscount ? Number(product.discountedPrice) : Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.price) - Number(product.discountedPrice!)) / Number(product.price)) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 md:pb-10 space-y-4 sm:space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#F48721] transition py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'সকল পণ্যে ফিরে যান' : 'Back to all products'}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-gray-100 shadow-sm">
        {/* Left: Product visual */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square rounded-2xl bg-[#FFF7ED] flex items-center justify-center relative overflow-hidden border border-[#F48721]/20">
            {hasDiscount && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#F48721] text-white text-xs font-black px-3 py-1 rounded-full shadow-md z-10">
                {language === 'bn' ? `${discountPercent}% ছাড়` : `${discountPercent}% OFF`}
              </span>
            )}
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized={!shouldOptimizeImage(product.imageUrl)}
                className="object-cover"
              />
            ) : (
              <span className="text-8xl select-none">🍯</span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-500 font-semibold">
            <span className="inline-flex items-center gap-1 text-[#059669]">
              <CheckCircle className="w-4 h-4" /> ১০০% ভেজালমুক্ত
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[#059669]">
              <CheckCircle className="w-4 h-4" /> খাঁটি গ্যারান্টি
            </span>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="flex flex-col justify-between space-y-5 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="bg-[#FFF7ED] text-[#F48721] text-xs font-bold px-3 py-1 rounded-full border border-[#F48721]/30">
                {product.unit || '১ ইউনিট'}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.avgRating ? product.avgRating.toFixed(1) : '4.9'}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount || 48})</span>
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-3xl font-black text-[#221E1F] leading-snug">
                {name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                {language === 'bn' ? product.nameEn : product.nameBn}
              </p>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <span className="text-2xl sm:text-3xl font-black text-[#F48721]">
                ৳{currentPrice.toFixed(0)}
              </span>
              {hasDiscount && (
                <span className="text-base sm:text-lg text-gray-400 line-through font-bold">
                  ৳{Number(product.price).toFixed(0)}
                </span>
              )}
              <span className="text-xs text-[#059669] font-bold bg-[#ECFDF5] px-2.5 py-0.5 rounded-full">
                স্টকে আছে ({product.stockCount} টি)
              </span>
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                {language === 'bn' ? 'পণ্যের বিবরণ' : 'Description'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {desc}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2.5 sm:p-3 bg-[#F8F8F8] rounded-xl text-center">
                <ShieldCheck className="w-5 h-5 text-[#F48721] mx-auto mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 block">১০০% অর্গানিক</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-[#F8F8F8] rounded-xl text-center">
                <Truck className="w-5 h-5 text-[#F48721] mx-auto mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 block">সারা দেশে ডেলিভারি</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-[#F8F8F8] rounded-xl text-center">
                <RotateCcw className="w-5 h-5 text-[#F48721] mx-auto mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 block">সহজ রিটার্ন</span>
              </div>
            </div>
          </div>

          {/* Action Row (Desktop inline; Mobile also pinned right above bottom nav) */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border-2 border-gray-200 rounded-full p-1 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-black text-sm text-[#221E1F]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to bag button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 sm:px-6 bg-[#FFF7ED] hover:bg-[#ffedd5] text-[#F48721] font-black rounded-full border-2 border-[#F48721] transition flex items-center justify-center gap-2 text-xs sm:text-sm shadow-xs"
              >
                <ShoppingCart className="w-4 h-4 shrink-0" />
                <span>{language === 'bn' ? 'ব্যাগে রাখুন' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Direct Order Now button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 bg-[#F48721] hover:bg-[#e07515] text-white font-black rounded-full transition text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>
                {language === 'bn'
                  ? `সরাসরি অর্ডার করুন (৳${(currentPrice * quantity).toFixed(0)})`
                  : `Order Now • COD (৳${(currentPrice * quantity).toFixed(0)})`}
              </span>
            </button>

            {addedToast && (
              <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-center text-xs font-bold text-[#065F46]">
                ✓ {language === 'bn' ? 'পণ্যটি ব্যাগে যোগ করা হয়েছে!' : 'Added to bag!'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Quick Buy Bar */}
      <div className="md:hidden fixed bottom-16 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] flex items-center gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="shrink-0 pr-1">
          <span className="block text-[10px] text-gray-500 font-semibold">
            {language === 'bn' ? 'মোট মূল্য' : 'Total'}
          </span>
          <span className="text-base font-black text-[#221E1F]">
            ৳{(currentPrice * quantity).toFixed(0)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-2.5 px-3 bg-[#FFF7ED] text-[#F48721] border border-[#F48721] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ব্যাগে রাখুন' : 'Add to Bag'}</span>
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-2.5 px-3 bg-[#F48721] text-white font-black text-xs rounded-xl active:scale-95 shadow-sm"
        >
          {language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-500 font-bold">
          লোড হচ্ছে...
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
