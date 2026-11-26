'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSupabaseClient } from '../../lib/supabase/client';
import { OrderCardSkeleton } from '../../components/LoadingSkeleton';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  items: { id: string }[];
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-[#F48721] text-white',
  CONFIRMED: 'bg-blue-500 text-white',
  PICKED_UP: 'bg-purple-500 text-white',
  ON_THE_WAY: 'bg-indigo-500 text-white',
  DELIVERED: 'bg-[#059669] text-white',
  CANCELLED: 'bg-red-500 text-white',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'অপেক্ষমান',
  CONFIRMED: 'নিশ্চিত',
  PICKED_UP: 'সংগ্রহ হয়েছে',
  ON_THE_WAY: 'পথে আছে',
  DELIVERED: 'ডেলিভারি সম্পন্ন',
  CANCELLED: 'বাতিল',
};

export default function OrdersPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login?redirect=/orders');
      return;
    }
    const loadMyOrders = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('orders')
          .select('id, status, total, created_at, items:order_items(id)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(
            (data as Array<{
              id: string;
              status?: string | null;
              total?: number | string | null;
              items?: { id: string }[] | null;
              created_at: string;
            }>).map((o) => ({
              id: o.id,
              status: (o.status || 'pending').toUpperCase(),
              totalAmount: Number(o.total || 0),
              items: o.items || [],
              createdAt: o.created_at,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMyOrders();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-5 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-black text-[#221E1F] mb-4 sm:mb-6">আমার অর্ডার</h1>

        {loading ? (
          <div className="space-y-4">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center gap-4">
            <Package className="w-16 h-16 text-gray-300" />
            <h2 className="text-xl font-bold text-[#221E1F]">কোনো অর্ডার নেই</h2>
            <p className="text-gray-500 text-sm">আপনি এখনো কোনো অর্ডার দেননি।</p>
            <Link href="/products" className="bg-[#F48721] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#e07515] transition">
              কেনাকাটা করুন
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">অর্ডার নম্বর</p>
                    <p className="font-black text-[#221E1F] text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[order.status] || 'bg-gray-200 text-gray-700'}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="font-bold text-[#F48721]">৳{Number(order.totalAmount).toFixed(0)}</span>
                  <span className="text-gray-400">•</span>
                  <span>{order.items?.length || 0} টি পণ্য</span>
                  <span className="text-gray-400">•</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('bn-BD')}</span>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between bg-[#FFF7ED] hover:bg-[#F48721]/10 text-[#F48721] font-bold text-sm px-4 py-2.5 rounded-xl transition"
                >
                  <span>ট্র্যাক করুন</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
