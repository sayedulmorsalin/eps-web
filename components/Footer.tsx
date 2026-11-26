'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-[#1A1817] text-gray-300 border-t border-neutral-800 mt-8 sm:mt-12 py-6 pb-22 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Compact Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F48721] flex items-center justify-center text-white text-base shrink-0">
              🌾
            </div>
            <div>
              <span className="font-black text-base text-white tracking-tight">EPSR</span>
              <span className="block text-[10px] text-gray-400">
                {language === 'bn'
                  ? 'রাজশাহী অনলাইন গ্রোসারি • সকাল ৯টা – রাত ১০টা'
                  : 'Rajshahi Online Grocery • 9 AM – 10 PM'}
              </span>
            </div>
          </div>

          {/* Quick Links + Hotline */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <Link href="/products" className="text-gray-300 hover:text-[#F48721] transition font-semibold">
              {language === 'bn' ? 'সকল পণ্য' : 'Products'}
            </Link>
            <Link href="/orders" className="text-gray-300 hover:text-[#F48721] transition font-semibold">
              {language === 'bn' ? 'অর্ডার ট্র্যাক' : 'Track Order'}
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-[#F48721] transition font-semibold">
              {t('login')}
            </Link>
            <Link href="/privacy-policy" className="text-gray-300 hover:text-[#F48721] transition font-semibold">
              {language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
            </Link>
            <Link href="/terms-and-conditions" className="text-gray-300 hover:text-[#F48721] transition font-semibold">
              {language === 'bn' ? 'শর্তাবলি' : 'Terms'}
            </Link>
            <a
              href="tel:+8801700000000"
              className="inline-flex items-center gap-1.5 font-extrabold text-[#F48721] hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t('hotline')}</span>
            </a>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-gray-500">
          <span>© 2026 EPSR — Easy Product Service Rajshahi</span>
          <span>support@epsr.com</span>
        </div>
      </div>
    </footer>
  );
};
