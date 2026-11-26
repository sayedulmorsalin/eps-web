'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSupabaseClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext';
import {
  CheckCircle2,
  Clock,
  Bike,
  PackageCheck,
  MapPin,
  Phone,
  Navigation,
  ExternalLink,
  Map as MapIcon,
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'preparing', label: 'Preparing Items', icon: PackageCheck },
  { key: 'assigned_to_rider', label: 'Rider Assigned', icon: Bike },
  { key: 'on_the_way', label: 'On The Way', icon: Navigation },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

interface OrderRecord {
  id: string;
  status: string;
  total: number | string;
  rider_id?: string | null;
  delivery_lat?: number | null;
  delivery_lng?: number | null;
  delivery_address?: string | null;
  deliveryAddress?: string | null;
  deliveryNotes?: string | null;
  rider?: {
    user?: { name?: string | null; phone?: string | null } | null;
    vehicleType?: string | null;
    vehicleNumber?: string | null;
  } | null;
}

function OrderTrackingContent() {
  const params = useParams();
  const orderId = params?.id as string;
  const { t } = useLanguage();

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const supabase = getSupabaseClient();

    // 1. Initial Order Fetch from Supabase
    const fetchOrderData = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*, product:products(*))')
          .eq('id', orderId)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setOrder(data);
          if (data.rider_id) {
            const { data: rProfile } = await supabase
              .from('rider_profiles')
              .select('current_lat, current_lng')
              .eq('id', data.rider_id)
              .maybeSingle();

            if (rProfile?.current_lat && rProfile?.current_lng) {
              setRiderLocation({
                lat: rProfile.current_lat,
                lng: rProfile.current_lng,
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();

    // 2. Real-time Supabase subscription for order status updates
    const orderChannel = supabase
      .channel(`order-track-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.new) {
            setOrder((prev) =>
              prev ? { ...prev, ...(payload.new as Partial<OrderRecord>) } : null,
            );
          }
        }
      )
      .subscribe();

    // 3. Real-time Supabase subscription for rider location streaming
    const riderChannel = supabase
      .channel(`rider-location-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rider_profiles',
        },
        (payload) => {
          if (payload.new && payload.new.current_lat && payload.new.current_lng) {
            setRiderLocation({
              lat: Number(payload.new.current_lat),
              lng: Number(payload.new.current_lng),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(riderChannel);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#F48721] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-bold text-gray-500">Connecting to live delivery tracking...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
        <p className="text-xs text-gray-500 mt-2">Could not retrieve details for Order #{orderId}</p>
      </div>
    );
  }

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 0;
      case 'preparing':
      case 'ready_for_pickup':
        return 1;
      case 'assigned_to_rider':
        return 2;
      case 'picked_up':
      case 'on_the_way':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-5 sm:space-y-8">
      {/* Header Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#F48721] tracking-wider uppercase block">
            {t('track_order')}
          </span>
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-0.5">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Payment: Cash on Delivery (৳{Number(order.total).toFixed(0)})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#F48721] animate-ping shrink-0" />
          <span className="px-3 py-1 bg-[#FFF7ED] text-[#F48721] font-extrabold text-xs rounded-full border border-[#F48721]/30 uppercase">
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Visual Live Tracker Progress Stepper */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs">
        <h3 className="font-extrabold text-sm text-gray-900 mb-4 sm:mb-6">Delivery Progress</h3>
        <div className="grid grid-cols-5 gap-1 sm:gap-2 relative">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-[#F48721] text-white shadow-md'
                      : 'bg-gray-100 text-gray-400'
                  } ${isCurrent ? 'ring-3 sm:ring-4 ring-[#F48721]/20 scale-105 sm:scale-110' : ''}`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold mt-2 leading-tight ${
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Map Section - Google Map Active when in hand of delivery man */}
      {(() => {
        const isWithDeliveryMan = ['assigned_to_rider', 'picked_up', 'on_the_way'].includes(
          (order.status || '').toLowerCase(),
        );

        if (isWithDeliveryMan) {
          const lat = riderLocation?.lat || 24.3745;
          const lng = riderLocation?.lng || 88.6042;
          const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=bn&z=15&output=embed`;
          const deliveryAddr =
            order.delivery_address || order.deliveryAddress || 'Shaheb Bazar, Rajshahi';
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${encodeURIComponent(deliveryAddr)}`;

          // Dynamic Haversine Distance & ETA Calculation
          const destLat = order.delivery_lat || 24.3785;
          const destLng = order.delivery_lng || 88.6012;
          const p = 0.017453292519943295;
          const a = 0.5 - Math.cos((destLat - lat) * p) / 2 +
            Math.cos(lat * p) * Math.cos(destLat * p) * (1 - Math.cos((destLng - lng) * p)) / 2;
          const distKm = (12742 * Math.asin(Math.sqrt(a))).toFixed(1);
          const etaMins = Math.max(2, Math.round((Number(distKm) / 20) * 60 + 3));
          const etaDisplay = Number(distKm) <= 0.2 ? 'পৌঁছে গেছেন' : `${etaMins} মিনিট (${distKm} কিমি)`;

          return (
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs space-y-0">
              {/* Google Map Bar */}
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                      <MapIcon className="w-4 h-4 text-[#F48721]" />
                      গুগল ম্যাপ লাইভ ট্র্যাকিং (Google Maps Live)
                    </h4>
                    <p className="text-[10px] text-gray-500 font-bold">
                      পণ্য ডেলিভারি ম্যানের হাতে রয়েছে • সরাসরি রিয়েল-টাইম জিপিএস ট্র্যাকিং
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
                    GPS: {lat.toFixed(4)}, {lng.toFixed(4)}
                  </span>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F48721] hover:bg-[#d97316] text-white text-xs font-bold rounded-xl transition shadow-xs"
                  >
                    <span>গুগল ম্যাপে ডিরেকশন</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="relative w-full h-64 sm:h-96 bg-gray-200">
                <iframe
                  title="Google Map Live Rider Tracking"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedUrl}
                  className="w-full h-full"
                />
              </div>

              {/* Live Status Strip (never overlaps map on small phones) */}
              <div className="bg-[#221E1F] text-white p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#F48721] flex items-center justify-center text-xl shadow-md shrink-0">
                    🛵
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">
                      {order.rider?.user?.name || 'রাইডার'}
                    </p>
                    <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
                      <span className="truncate">ডেলিভারি নিয়ে আপনার ঠিকানার দিকে অগ্রসর হচ্ছেন</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:block sm:text-right sm:pl-4 border-t sm:border-t-0 sm:border-l border-neutral-700 pt-2 sm:pt-0 shrink-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">আনুমানিক সময়</p>
                  <p className="text-sm font-black text-[#F48721]">{etaDisplay}</p>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs text-center space-y-3">
            <div className="w-14 h-14 bg-[#FFF7ED] text-[#F48721] rounded-2xl mx-auto flex items-center justify-center text-2xl">
              📦
            </div>
            <h4 className="font-extrabold text-sm text-gray-900">
              {order.status === 'delivered'
                ? 'ডেলিভারি সম্পন্ন হয়েছে'
                : 'অর্ডারটি সেন্ট্রাল হাবে প্রসেসিং হচ্ছে'}
            </h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {order.status === 'delivered'
                ? 'আপনার পণ্য সফলভাবে পৌঁছে দেওয়া হয়েছে। EPSR-এর সাথে থাকার জন্য ধন্যবাদ!'
                : 'ডেলিভারি ম্যান পণ্য সংগ্রহ করে আপনার ঠিকানার উদ্দেশ্যে রওনা হলে এখানে স্বয়ংক্রিয়ভাবে লাইভ গুগল ম্যাপ (Google Maps) ও রিয়েল-টাইম জিপিএস সক্রিয় হবে।'}
            </p>
            {order.status !== 'delivered' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>ডেলিভারি ম্যানের হাতে পৌঁছালে লাইভ গুগল ম্যাপ দৃশ্যমান হবে</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Rider & Address Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-gray-900">{t('rider_info')}</h3>
          {order.rider ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center text-xl text-[#F48721] font-bold">
                  🏍️
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">
                    {order.rider.user?.name || 'Delivery Partner'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {order.rider.vehicleType || 'Motorcycle'} • {order.rider.vehicleNumber || 'Rajshahi Metro'}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${order.rider.user?.phone || '+8801700000002'}`}
                className="p-3 bg-[#FFF7ED] hover:bg-[#ffeedd] text-[#F48721] rounded-full transition"
                title={t('call_rider')}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Searching for nearest available rider in Rajshahi...</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <h3 className="font-extrabold text-sm text-gray-900">{t('delivery_address')}</h3>
          <div className="flex items-start gap-2 pt-1 text-xs text-gray-700">
            <MapPin className="w-4 h-4 text-[#F48721] shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              {order.delivery_address || order.deliveryAddress || 'রাজশাহী'}
            </p>
          </div>
          {order.deliveryNotes && (
            <p className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              Note: {order.deliveryNotes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading order details...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
