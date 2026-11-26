'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackAddToCart, trackEvent } from '../lib/analytics';

export interface CartItem {
  id: string; // product id
  nameEn: string;
  nameBn: string;
  price: number;
  discountedPrice?: number;
  unit?: string;
  imageUrl?: string;
  vendorId: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('epsr_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('epsr_cart', JSON.stringify(newItems));
  };

  const addItem = (product: any, quantity = 1) => {
    const existing = items.find((i) => i.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = items.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
      );
    } else {
      updated = [
        ...items,
        {
          id: product.id,
          nameEn: product.nameEn,
          nameBn: product.nameBn,
          price: Number(product.price),
          discountedPrice: product.discountedPrice ? Number(product.discountedPrice) : undefined,
          unit: product.unit,
          imageUrl: product.imageUrl,
          vendorId: product.vendorId,
          quantity,
        },
      ];
    }
    saveItems(updated);
    trackAddToCart(product, quantity);
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = items
      .map((i) => {
        if (i.id === id) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      })
      .filter(Boolean) as CartItem[];
    saveItems(updated);
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      trackEvent({
        eventName: 'remove_from_cart',
        eventCategory: 'ecommerce',
        properties: { productId: id, productName: item.nameBn || item.nameEn },
      });
    }
    const updated = items.filter((i) => i.id !== id);
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.discountedPrice ? item.discountedPrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
