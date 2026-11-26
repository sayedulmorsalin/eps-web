'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid2x2, ShoppingBag, Package, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function MobileBottomNavInner() {
  const pathname = usePathname() || '/';
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const labels =
    language === 'bn'
      ? {
          home: 'হোম',
          shop: 'পণ্য',
          bag: 'ব্যাগ',
          orders: 'অর্ডার',
          account: 'অ্যাকাউন্ট',
        }
      : {
          home: 'Home',
          shop: 'Shop',
          bag: 'Bag',
          orders: 'Orders',
          account: 'Account',
        };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_18px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition active:scale-95 ${
            isActive('/') ? 'text-[#F48721]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{labels.home}</span>
        </Link>

        <Link
          href="/products"
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition active:scale-95 ${
            isActive('/products') ? 'text-[#F48721]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Grid2x2 className="w-5 h-5" />
          <span>{labels.shop}</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold text-gray-700 hover:text-[#F48721] transition active:scale-95"
        >
          <div className="relative">
            <div className="w-10 h-7 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#F48721] border border-[#F48721]/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#221E1F] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[#221E1F]">{labels.bag}</span>
        </button>

        <Link
          href="/orders"
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition active:scale-95 ${
            isActive('/orders') ? 'text-[#F48721]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>{labels.orders}</span>
        </Link>

        <Link
          href={user ? '/orders' : '/login'}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition active:scale-95 ${
            isActive('/login') || isActive('/register')
              ? 'text-[#F48721]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="max-w-[60px] truncate">
            {user ? user.name.split(' ')[0] : labels.account}
          </span>
        </Link>
      </div>
    </nav>
  );
}

export const MobileBottomNav = () => (
  <Suspense fallback={null}>
    <MobileBottomNavInner />
  </Suspense>
);
