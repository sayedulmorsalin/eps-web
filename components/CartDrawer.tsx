'use client';

import React from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const CartDrawer = () => {
  const { items, updateQuantity, removeItem, subtotal, isCartOpen, setIsCartOpen } =
    useCart();
  const { language, t } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#FFF7ED]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F48721]" />
              <h2 className="font-extrabold text-[#221E1F] text-base">
                {t('cart')} ({items.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 sm:space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🧺</div>
                <p className="text-gray-500 font-bold text-sm">
                  {language === 'bn'
                    ? 'আপনার ব্যাগে কোনো পণ্য নেই'
                    : 'Your grocery bag is empty'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-5 py-3 bg-[#F48721] text-white text-xs font-bold rounded-full hover:bg-[#e07515] transition shadow-md"
                >
                  {language === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = item.discountedPrice || item.price;
                const name = language === 'bn' ? item.nameBn : item.nameEn;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-gray-50/80 rounded-2xl border border-gray-100"
                  >
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl shrink-0 border border-gray-100 shadow-xs overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        '🍯'
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
                        {name}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {item.unit || '১ ইউনিট'}
                      </p>
                      <p className="text-xs font-black text-[#F48721] mt-0.5">
                        ৳{Number(itemPrice).toFixed(0)}
                      </p>
                    </div>

                    {/* Touch-friendly Quantity controls */}
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-[#F48721] rounded-lg active:bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-[#F48721] rounded-lg active:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-rose-500 p-2 transition shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-gray-100 bg-[#FFFDF9] space-y-2.5">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-gray-900">৳{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{t('delivery_fee')}</span>
                <span className="font-bold text-[#059669]">
                  {language === 'bn' ? 'বিনামূল্যে (Free)' : 'Free'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-[#221E1F] pt-2 border-t border-gray-200">
                <span>{t('total')}</span>
                <span className="text-[#F48721] text-lg font-black">
                  ৳{subtotal.toFixed(0)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 bg-[#F48721] hover:bg-[#e07515] text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-lg active:scale-[0.99]"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
