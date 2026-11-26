'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Globe, User, LogOut, Package, PhoneCall } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Compact top micro bar */}
      <div className="bg-[#221E1F] text-white py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px] sm:text-xs">
          <a
            href="tel:+8801700000000"
            className="font-bold hover:text-[#F48721] transition flex items-center gap-1.5 min-w-0 truncate"
          >
            <span className="bg-[#F48721] text-white px-1.5 py-0.5 rounded-full font-bold text-[9px] shrink-0">
              HOTLINE
            </span>
            <PhoneCall className="w-3 h-3 text-[#F48721] shrink-0" />
            <span className="truncate">{t('hotline')}</span>
          </a>

          <div className="hidden md:flex items-center gap-4 text-gray-300">
            <span>🚚 {t('delivery_guarantee')}</span>
            <span>•</span>
            <span>🛡️ {t('best_price')}</span>
            <span>•</span>
            <span>💵 {t('cash_on_delivery')}</span>
          </div>

          <button
            type="button"
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 text-gray-200 hover:text-[#F48721] font-bold transition shrink-0 px-2 py-0.5 rounded-full bg-white/10"
          >
            <Globe className="w-3 h-3 text-[#F48721]" />
            <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
          {/* EPSR Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition border border-[#F48721]/30">
              <img
                src="/epsr-icon.svg"
                alt="EPSR"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-[#221E1F]">
                  EP
                </span>
                <span className="font-black text-xl sm:text-2xl tracking-tight text-[#F48721]">
                  SR
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-gray-500 font-bold tracking-tight -mt-1">
                Easy Product Service Rajshahi
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-2 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-11 pr-28 py-3 rounded-full border-2 border-gray-200 focus:outline-none focus:border-[#F48721] focus:ring-2 focus:ring-[#F48721]/20 text-sm transition bg-gray-50/50"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-[#F48721] hover:bg-[#e07515] text-white text-xs font-bold rounded-full transition shadow-xs"
              >
                {language === 'bn' ? 'খুঁজুন' : 'Search'}
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#F48721] px-2.5 sm:px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#F48721] transition"
                >
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F48721]" />
                  <span className="hidden sm:inline">{t('my_orders')}</span>
                  <span className="sm:hidden">{language === 'bn' ? 'অর্ডার' : 'Orders'}</span>
                </Link>
                <span className="text-xs font-bold text-gray-800 max-w-[100px] truncate hidden md:inline">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-rose-600 transition"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-bold px-3 sm:px-4 py-2 text-gray-800 hover:text-[#F48721] border border-gray-200 hover:border-[#F48721] rounded-full transition min-h-[36px]"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F48721]" />
                <span>{t('login')}</span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-[#F48721] hover:bg-[#e07515] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-black text-xs transition shadow-sm hover:shadow-md min-h-[36px]"
              aria-label={t('cart')}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t('cart')}</span>
              {totalItems > 0 && (
                <span className="bg-[#221E1F] text-white min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold text-[11px]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search input (16px font stops iOS Safari auto-zoom) */}
        <form onSubmit={handleSearch} className="pb-2.5 md:hidden">
          <div className="relative flex items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-9 pr-20 py-2 rounded-full border border-gray-200 text-base focus:outline-none focus:border-[#F48721] bg-gray-50"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-3.5 py-1.5 bg-[#F48721] text-white text-xs font-bold rounded-full"
            >
              {language === 'bn' ? 'খুঁজুন' : 'Go'}
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};
