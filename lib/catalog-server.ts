import { cacheLife } from 'next/cache';
import type { Product } from '../components/ProductCard';
import {
  mapProductRow,
  PRODUCT_CARD_COLUMNS,
  type SupabaseProductRow,
} from './catalog';

export async function getCachedHomeProducts(): Promise<{
  products: Product[];
  fetched: boolean;
}> {
  'use cache';
  cacheLife('minutes');

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey) {
    return { products: [], fetched: false };
  }

  try {
    const endpoint = `${baseUrl.replace(/\/$/, '')}/rest/v1/products?select=${encodeURIComponent(
      PRODUCT_CARD_COLUMNS
    )}&is_active=eq.true&order=created_at.desc&limit=12`;

    const response = await fetch(endpoint, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      signal: AbortSignal.timeout(3500),
    });

    if (!response.ok) {
      return { products: [], fetched: false };
    }

    const rows = (await response.json()) as SupabaseProductRow[];
    if (!Array.isArray(rows)) {
      return { products: [], fetched: false };
    }

    return {
      products: rows.map(mapProductRow),
      fetched: true,
    };
  } catch {
    return { products: [], fetched: false };
  }
}
