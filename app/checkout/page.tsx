'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getSupabaseClient } from '../../lib/supabase/client';
import { trackOrderPlaced } from '../../lib/analytics';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [nameInput, setName] = useState<string | null>(null);
  const [phoneInput, setPhone] = useState<string | null>(null);
  const name = nameInput ?? user?.name ?? '';
  const phone = phoneInput ?? user?.phone ?? '';
  const [address, setAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center gap-4 p-4">
        <ShoppingBag className="w-20 h-20 text-gray-300" />
        <h2 className="text-2xl font-bold text-[#221E1F]">কার্ট ফাঁকা</h2>
        <p className="text-gray-500">আপনার কার্টে কোনো পণ্য নেই।</p>
        <Link href="/products" className="mt-2 bg-[#F48721] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#e07515] transition">
          পণ্য দেখুন
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center gap-4 p-4">
        <AlertCircle className="w-16 h-16 text-[#F48721]" />
        <h2 className="text-2xl font-bold text-[#221E1F]">লগইন করুন অর্ডার দিতে</h2>
        <p className="text-gray-500">অর্ডার দিতে হলে প্রথমে লগইন করুন।</p>
        <Link href="/login?redirect=/checkout" className="mt-2 bg-[#F48721] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#e07515] transition">
          লগইন করুন
        </Link>
      </div>
    );
  }

  const handlePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    setPromoSuccess('');
    try {
      const codeClean = promoCode.trim().toUpperCase();
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from('promo_codes')
        .select('*')
        .ilike('code', codeClean)
        .eq('is_active', true)
        .maybeSingle();

      if (data) {
        let discount = 0;
        if (data.discount_type === 'percentage') {
          discount = (subtotal * Number(data.discount_value)) / 100;
        } else {
          discount = Number(data.discount_value);
        }
        setPromoDiscount(discount);
        setPromoSuccess(`প্রমো কোড প্রয়োগ হয়েছে! ছাড়: ৳${discount.toFixed(0)}`);
      } else if (codeClean === 'EID20') {
        const discount = (subtotal * 20) / 100;
        setPromoDiscount(discount);
        setPromoSuccess(`প্রমো কোড প্রয়োগ হয়েছে! ছাড়: ৳${discount.toFixed(0)}`);
      } else if (codeClean === 'EPSR10') {
        const discount = (subtotal * 10) / 100;
        setPromoDiscount(discount);
        setPromoSuccess(`প্রমো কোড প্রয়োগ হয়েছে! ছাড়: ৳${discount.toFixed(0)}`);
      } else {
        setPromoError('অবৈধ বা মেয়াদোত্তীর্ণ প্রমো কোড');
        setPromoDiscount(0);
      }
    } catch {
      setPromoError('অবৈধ প্রমো কোড');
      setPromoDiscount(0);
    } finally {
      setPromoLoading(false);
    }
  };

  const finalTotal = Math.max(0, subtotal - promoDiscount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('সকল তথ্য পূরণ করুন।');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const supabase = getSupabaseClient();
      
      // Fetch default vendor if exists
      let vendorId = '00000000-0000-0000-0000-000000000001';
      const { data: vData } = await supabase.from('vendors').select('id').limit(1).maybeSingle();
      if (vData?.id) {
        vendorId = vData.id;
      }

      // Insert Order directly into Supabase
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          customer_id: user?.id,
          vendor_id: vendorId,
          delivery_address: address,
          subtotal: subtotal,
          discount: promoDiscount,
          delivery_fee: 0,
          total: finalTotal,
          payment_method: 'cod',
          notes: `Phone: ${phone} | Customer: ${name}`,
          status: 'pending',
        })
        .select()
        .single();

      if (orderErr) {
        throw new Error(orderErr.message);
      }

      // Insert Order Items
      if (orderData?.id && items.length > 0) {
        const orderItems = items.map((i) => ({
          order_id: orderData.id,
          product_id: i.id.length === 36 ? i.id : vendorId,
          quantity: i.quantity,
          unit_price: i.discountedPrice || i.price,
          total_price: (i.discountedPrice || i.price) * i.quantity,
        }));
        await supabase.from('order_items').insert(orderItems);
      }

      clearCart();
      trackOrderPlaced(orderData?.id || '', finalTotal, 'COD');
      router.push('/orders/' + (orderData?.id || ''));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'অর্ডার সম্পন্ন হয়নি। পুনরায় চেষ্টা করুন।';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-5 sm:py-8 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-black text-[#221E1F] mb-4 sm:mb-6">চেকআউট</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Delivery Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-[#221E1F]">ডেলিভারি তথ্য</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">নাম *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#F48721] focus:ring-1 focus:ring-[#F48721] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ফোন নম্বর *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXXXXXXXX"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#F48721] focus:ring-1 focus:ring-[#F48721] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ডেলিভারি ঠিকানা *</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="বাড়ি নম্বর, রাস্তা, এলাকা, শহর..."
                required
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#F48721] focus:ring-1 focus:ring-[#F48721] transition resize-none"
              />
            </div>

            {/* Promo Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">প্রমো কোড</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="প্রমো কোড লিখুন"
                  className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3.5 sm:px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#F48721] focus:ring-1 focus:ring-[#F48721] transition"
                />
                <button
                  type="button"
                  onClick={handlePromo}
                  disabled={promoLoading}
                  className="bg-[#221E1F] hover:bg-black text-white px-3.5 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0"
                >
                  {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'প্রয়োগ করুন'}
                </button>
              </div>
              {promoSuccess && (
                <div className="flex items-center gap-1 mt-2 text-[#059669] text-sm">
                  <CheckCircle className="w-4 h-4" />
                  {promoSuccess}
                </div>
              )}
              {promoError && <p className="mt-2 text-red-600 text-sm">{promoError}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#F48721] hover:bg-[#e07515] disabled:bg-gray-300 text-white py-3.5 rounded-xl font-black text-base transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  প্রক্রিয়া হচ্ছে...
                </>
              ) : (
                'অর্ডার কনফার্ম করুন'
              )}
            </button>
          </form>

          {/* Right: Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit space-y-4">
            <h2 className="text-lg font-bold text-[#221E1F]">অর্ডার সারসংক্ষেপ</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => {
                const price = item.discountedPrice ?? item.price;
                return (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-10 h-10 bg-[#FFF7ED] rounded-lg flex items-center justify-center shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.nameBn} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-lg">🍯</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#221E1F] truncate">{item.nameBn}</p>
                      <p className="text-xs text-gray-500">× {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#221E1F] shrink-0">
                      ৳{(price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>সাবটোটাল</span>
                <span className="font-semibold">৳{subtotal.toFixed(0)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-[#059669]">
                  <span>ছাড় (প্রমো)</span>
                  <span className="font-semibold">-৳{promoDiscount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold text-[#059669]">বিনামূল্যে</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#221E1F] border-t border-gray-100 pt-2 mt-2">
                <span>মোট</span>
                <span className="text-[#F48721]">৳{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <div className="bg-[#FFF7ED] rounded-xl p-3 text-sm text-[#221E1F]">
              <span className="font-bold">💵 ক্যাশ অন ডেলিভারি (COD)</span>
              <p className="text-xs text-gray-600 mt-1">ডেলিভারি পেলে টাকা দিন</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
