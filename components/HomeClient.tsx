'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard, type Product } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { trackPageView } from '../lib/analytics';
import {
  EPSR_CATEGORIES,
  fetchHomeProductsClient,
  getInstantHomeProducts,
  seedCatalogProducts,
} from '../lib/catalog';

interface HomeClientProps {
  initialProducts: Product[];
  initialFetched: boolean;
}

export function HomeClient({ initialProducts, initialFetched }: HomeClientProps) {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(!initialFetched && initialProducts.length === 0);
  const categories = EPSR_CATEGORIES;

  useEffect(() => {
    trackPageView('/');
    let active = true;

    const loadHome = async () => {
      if (initialProducts.length > 0) {
        seedCatalogProducts(initialProducts, 'home');
        return;
      }

      await Promise.resolve();
      const cached = getInstantHomeProducts();
      if (active && cached.products.length > 0) {
        setProducts(cached.products);
        setLoading(false);
        if (cached.fresh) return;
      }

      try {
        const fresh = await fetchHomeProductsClient();
        if (active && (fresh.length > 0 || !initialFetched)) {
          setProducts(fresh);
        }
      } catch (err) {
        console.error('Failed to load products from Supabase:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (initialFetched && initialProducts.length > 0) {
      seedCatalogProducts(initialProducts, 'home');
      const timer = setTimeout(async () => {
        try {
          const fresh = await fetchHomeProductsClient();
          if (active && fresh.length > 0) {
            setProducts(fresh);
          }
        } catch {
          // Keep server-rendered products on silent background error
        }
      }, 1500);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }

    void loadHome();
    return () => {
      active = false;
    };
  }, [initialFetched, initialProducts]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-10">
      {/* EPSR Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#221E1F] via-[#2F2621] to-[#F48721] text-white p-5 sm:p-10 lg:p-12 shadow-xl border border-neutral-800">
        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F48721]/20 text-[#F48721] text-[11px] sm:text-xs font-black border border-[#F48721]/40 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{language === 'bn' ? 'কুপন: EID20 দিয়ে ২০% ক্যাশব্যাক' : 'Use Code: EID20 for 20% OFF'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight">
            {language === 'bn'
              ? 'রাজশাহীর অনলাইন গ্রোসারি সুপারশপ'
              : 'EPSR Online Grocery Superstore'}
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none">
            {t('tagline')}. তাজা শাকসবজি, চাল-ডাল, সয়াবিন তেল, ডিম, খাঁটি দুধ ও নিত্যপ্রয়োজনীয় সকল মুদি সামগ্রী সরাসরি আপনার বাসায় পৌঁছে দিচ্ছি মাত্র ৬০ মিনিটে।
          </p>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-3">
            <Link
              href="/products"
              className="flex-1 sm:flex-initial justify-center px-5 sm:px-7 py-3 sm:py-3.5 bg-[#F48721] hover:bg-[#e07515] text-white font-black text-xs sm:text-sm rounded-full transition shadow-lg hover:shadow-xl flex items-center gap-2 min-h-[44px]"
            >
              <span>{language === 'bn' ? 'বাজার করুন' : 'Shop Grocery'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+8801700000000"
              className="px-4 sm:px-6 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-full border border-white/20 transition backdrop-blur-xs min-h-[44px] inline-flex items-center"
            >
              📞 {t('hotline')}
            </a>
          </div>
        </div>

        {/* Decorative graphic right */}
        <div className="hidden lg:flex absolute right-10 bottom-0 top-0 items-center justify-center pointer-events-none select-none">
          <div className="relative">
            <div className="w-64 h-64 rounded-full bg-[#F48721]/20 blur-3xl absolute -inset-4" />
            <span className="text-[120px] relative z-10 drop-shadow-2xl">🥦</span>
          </div>
        </div>
      </section>

      {/* Trust Highlights - Compact on Mobile */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-2.5 sm:gap-3 shadow-xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#F48721] shrink-0 font-bold text-lg sm:text-xl">
            🌾
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-[11px] sm:text-xs text-gray-900 line-clamp-1">{t('best_price')}</h4>
            <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1">ভেজালমুক্ত প্রাকৃতিক খাদ্যপণ্য</p>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-2.5 sm:gap-3 shadow-xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#F48721] shrink-0 font-bold text-lg sm:text-xl">
            💵
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-[11px] sm:text-xs text-gray-900 line-clamp-1">{t('cash_on_delivery')}</h4>
            <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1">পণ্য দেখে মূল্য পরিশোধ করুন</p>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-2.5 sm:gap-3 shadow-xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#F48721] shrink-0 font-bold text-lg sm:text-xl">
            🚚
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-[11px] sm:text-xs text-gray-900 line-clamp-1">{t('delivery_guarantee')}</h4>
            <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1">দ্রুত হোম ডেলিভারি</p>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-2.5 sm:gap-3 shadow-xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#F48721] shrink-0 font-bold text-lg sm:text-xl">
            ⭐
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-[11px] sm:text-xs text-gray-900 line-clamp-1">বিশ্বস্ত কাস্টমার রিভিউ</h4>
            <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1">হাজারো পরিবারের সন্তুষ্টি</p>
          </div>
        </div>
      </section>

      {/* Categories Rail (Horizontal swipe on mobile, 6-col grid on desktop) */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#221E1F]">{t('popular_categories')}</h2>
            <p className="text-[11px] sm:text-xs text-gray-500">বিশুদ্ধ ও স্বাস্থ্যসম্মত খাদ্য বিভাগসমূহ</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-black text-[#F48721] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>সকল পণ্য</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-1 sm:grid sm:grid-cols-3 md:grid-cols-6 sm:gap-3 sm:overflow-visible">
          {categories.map((cat) => {
            const catName = language === 'bn' ? cat.nameBn : cat.nameEn;
            return (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="w-[104px] sm:w-auto shrink-0 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-2 hover:border-[#F48721] hover:shadow-md transition group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF7ED] flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition">
                  {cat.icon || '🍯'}
                </div>
                <span className="font-extrabold text-[11px] sm:text-xs text-gray-900 group-hover:text-[#F48721] line-clamp-1">
                  {catName}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Daily Best Sells (EPSR Lineup) */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#221E1F]">{t('daily_best_sells')}</h2>
            <p className="text-[11px] sm:text-xs text-gray-500">সবচেয়ে জনপ্রিয় খাঁটি খাদ্যপণ্যসমূহ</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-black text-[#F48721] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>আরও দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 space-y-3 animate-pulse">
                <div className="aspect-square rounded-xl bg-gray-100" />
                <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-8 bg-gray-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-500">
            {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 4} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
