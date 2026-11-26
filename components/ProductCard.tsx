'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { shouldOptimizeImage } from '../lib/catalog';

export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
  nameEn: string;
  nameBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  price: number;
  discountedPrice?: number;
  stockCount: number;
  unit?: string;
  imageUrl?: string;
  avgRating?: number;
  reviewCount?: number;
}

export const ProductCard: React.FC<{ product: Product; priority?: boolean }> = React.memo(
  ({ product, priority = false }) => {
  const { items, addItem, updateQuantity } = useCart();
  const { language, t } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const cartItem = items.find((i) => i.id === product.id);
  const name = language === 'bn' ? product.nameBn : product.nameEn;
  const hasDiscount =
    product.discountedPrice && Number(product.discountedPrice) < Number(product.price);
  const currentPrice = hasDiscount
    ? Number(product.discountedPrice)
    : Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.discountedPrice!)) /
          Number(product.price)) *
          100,
      )
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white rounded-2xl border border-gray-100 p-2.5 sm:p-4 flex flex-col justify-between hover:shadow-xl hover:border-[#F48721]/30 transition-all duration-300 group relative cursor-pointer"
    >
      {/* Discount Pill */}
      {hasDiscount && (
        <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#F48721] text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 shadow-xs">
          {language === 'bn' ? `${discountPercent}% ছাড়` : `${discountPercent}% OFF`}
        </span>
      )}

      {/* Product Image */}
      <div className="overflow-hidden rounded-xl bg-[#F8F8F8] aspect-square flex items-center justify-center relative mb-2.5 sm:mb-3">
        {product.imageUrl && !imgError ? (
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 240px"
            priority={priority}
            unoptimized={!shouldOptimizeImage(product.imageUrl)}
            draggable={false}
            onError={() => setImgError(true)}
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <span className="text-4xl sm:text-5xl group-hover:scale-110 transition duration-300">
            🍯
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-500 font-bold mb-1">
          <Star className="w-3 h-3 fill-amber-400 shrink-0" />
          <span>{product.avgRating ? product.avgRating.toFixed(1) : '4.9'}</span>
          <span className="text-gray-400 font-normal truncate">
            ({product.reviewCount || 24})
          </span>
        </div>

        <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-snug group-hover:text-[#F48721] transition">
          {name}
        </h3>
        <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-1 bg-gray-50 inline-block px-2 py-0.5 rounded-md max-w-full truncate">
          {product.unit || '১ ইউনিট'}
        </p>
      </div>

      {/* Bottom: Price + Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2.5 pt-2.5 border-t border-gray-100">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-sm sm:text-base font-black text-[#221E1F]">
            ৳{currentPrice.toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] sm:text-xs text-gray-400 line-through">
              ৳{Number(product.price).toFixed(0)}
            </span>
          )}
        </div>

        {/* Add to Cart or Quantity Controller */}
        {cartItem ? (
          <div
            className="flex items-center justify-between sm:justify-center gap-1 bg-[#FFF7ED] border border-[#F48721]/30 rounded-xl p-1 w-full sm:w-auto"
            onClick={(e) => e.preventDefault()}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateQuantity(product.id, -1);
              }}
              className="w-7 h-7 flex items-center justify-center text-[#F48721] hover:bg-[#F48721] hover:text-white rounded-lg transition"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-black text-[#221E1F] w-6 text-center">
              {cartItem.quantity}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateQuantity(product.id, 1);
              }}
              className="w-7 h-7 flex items-center justify-center text-[#F48721] hover:bg-[#F48721] hover:text-white rounded-lg transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product, 1);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#F48721] hover:bg-[#e07515] active:scale-95 text-white px-3 py-2 rounded-xl text-xs font-black transition shadow-xs hover:shadow-md"
          >
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t('add_to_cart')}</span>
          </button>
        )}
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';
