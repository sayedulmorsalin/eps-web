import type { Product } from '../components/ProductCard';
import { getSupabaseClient } from './supabase/client';

export interface CategoryItem {
  id: string;
  nameEn: string;
  nameBn: string;
  icon?: string;
}

export const EPSR_CATEGORIES: CategoryItem[] = [
  { id: '1', nameEn: 'Fresh Vegetables', nameBn: 'তাজা শাকসবজি', icon: '🥦' },
  { id: '2', nameEn: 'Rice & Lentils', nameBn: 'চাল ও ডাল', icon: '🌾' },
  { id: '3', nameEn: 'Cooking Oil & Ghee', nameBn: 'তেল ও ঘি', icon: '🫙' },
  { id: '4', nameEn: 'Eggs & Dairy', nameBn: 'ডিম ও দুধ', icon: '🥚' },
  { id: '5', nameEn: 'Fish & Meat', nameBn: 'মাছ ও মাংস', icon: '🥩' },
  { id: '6', nameEn: 'Spices & Masala', nameBn: 'মসলা ও লবণ', icon: '🌶️' },
];

export const PRODUCT_CARD_COLUMNS =
  'id,vendor_id,category_id,name_en,name_bn,price,discounted_price,stock_count,unit,image_url,avg_rating,total_reviews';

export const PRODUCT_DETAIL_COLUMNS = `${PRODUCT_CARD_COLUMNS},description_en,description_bn`;

export interface SupabaseProductRow {
  id: string;
  vendor_id: string;
  category_id: string;
  name_en: string;
  name_bn?: string | null;
  description_en?: string | null;
  description_bn?: string | null;
  price: number | string;
  discounted_price?: number | string | null;
  stock_count?: number | null;
  unit?: string | null;
  image_url?: string | null;
  avg_rating?: number | string | null;
  total_reviews?: number | null;
}

export function mapProductRow(row: SupabaseProductRow): Product {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    categoryId: row.category_id,
    nameEn: row.name_en,
    nameBn: row.name_bn || row.name_en,
    descriptionEn: row.description_en || undefined,
    descriptionBn: row.description_bn || undefined,
    price: Number(row.price),
    discountedPrice: row.discounted_price ? Number(row.discounted_price) : undefined,
    stockCount: row.stock_count || 0,
    unit: row.unit || '',
    imageUrl: row.image_url || undefined,
    avgRating: Number(row.avg_rating || 5.0),
    reviewCount: row.total_reviews || 0,
  };
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const MEMORY_CACHE_TTL_MS = 60 * 1000;
const SESSION_HOME_KEY = 'epsr_home_products_cache_v1';
const SESSION_CATEGORIES_KEY = 'epsr_categories_cache_v1';
const SESSION_PRODUCTS_MAP_KEY = 'epsr_products_by_id_v1';

const productListCache = new Map<string, CacheEntry<Product[]>>();
const productByIdCache = new Map<string, CacheEntry<Product>>();
const inFlightList = new Map<string, Promise<Product[]>>();
let categoriesCache: CacheEntry<CategoryItem[]> | null = null;
let inFlightCategories: Promise<CategoryItem[]> | null = null;

function readSessionCache<T>(key: string): CacheEntry<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

function writeSessionCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Ignore quota errors
  }
}

export function isCacheFresh(timestamp: number, ttlMs = MEMORY_CACHE_TTL_MS): boolean {
  return Date.now() - timestamp < ttlMs;
}

export function seedCatalogProducts(products: Product[], cacheKey = 'home'): void {
  if (!products.length) return;
  const now = Date.now();
  productListCache.set(cacheKey, { data: products, timestamp: now });
  for (const product of products) {
    productByIdCache.set(product.id, { data: product, timestamp: now });
  }

  if (cacheKey === 'home') {
    writeSessionCache(SESSION_HOME_KEY, products);
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = readSessionCache<Record<string, Product>>(SESSION_PRODUCTS_MAP_KEY)?.data || {};
      for (const product of products.slice(0, 24)) {
        existing[product.id] = product;
      }
      writeSessionCache(SESSION_PRODUCTS_MAP_KEY, existing);
    } catch {
      // Ignore quota errors
    }
  }
}

export function getInstantHomeProducts(): { products: Product[]; fresh: boolean } {
  const mem = productListCache.get('home');
  if (mem && mem.data.length > 0) {
    return { products: mem.data, fresh: isCacheFresh(mem.timestamp) };
  }
  const sess = readSessionCache<Product[]>(SESSION_HOME_KEY);
  if (sess && sess.data.length > 0) {
    productListCache.set('home', sess);
    return { products: sess.data, fresh: isCacheFresh(sess.timestamp) };
  }
  return { products: [], fresh: false };
}

export function getCachedProductList(cacheKey: string): { products: Product[]; fresh: boolean } | null {
  const mem = productListCache.get(cacheKey);
  if (!mem) return null;
  return { products: mem.data, fresh: isCacheFresh(mem.timestamp) };
}

export function getInMemoryProductById(id: string): Product | null {
  return productByIdCache.get(id)?.data ?? null;
}

export function getCachedProductById(id: string): Product | null {
  const mem = productByIdCache.get(id);
  if (mem) return mem.data;
  const sessMap = readSessionCache<Record<string, Product>>(SESSION_PRODUCTS_MAP_KEY);
  const found = sessMap?.data?.[id];
  if (found) {
    productByIdCache.set(id, { data: found, timestamp: sessMap.timestamp });
    return found;
  }
  return null;
}

export function shouldOptimizeImage(src?: string | null): boolean {
  if (!src) return false;
  if (src.startsWith('/')) return true;
  try {
    const parsed = new URL(src);
    if (parsed.hostname === 'images.unsplash.com') return true;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const sbHost = new URL(supabaseUrl).hostname;
      if (parsed.hostname === sbHost && parsed.pathname.startsWith('/storage/v1/object/public/')) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

export async function fetchHomeProductsClient(): Promise<Product[]> {
  const key = 'home';
  const existing = inFlightList.get(key);
  if (existing) return existing;

  const request = (async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_CARD_COLUMNS)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) {
      throw error;
    }

    const mapped = ((data || []) as SupabaseProductRow[]).map(mapProductRow);
    seedCatalogProducts(mapped, key);
    return mapped;
  })();

  inFlightList.set(key, request);
  try {
    return await request;
  } finally {
    inFlightList.delete(key);
  }
}

export interface ProductQueryOptions {
  search?: string;
  categoryId?: string;
  sortBy?: string;
}

export async function fetchFilteredProductsClient(options: ProductQueryOptions): Promise<Product[]> {
  const search = (options.search || '').trim();
  const categoryId = options.categoryId || '';
  const sortBy = options.sortBy || 'newest';
  const cacheKey = `list:${categoryId}:${sortBy}:${search.toLowerCase()}`;

  const existing = inFlightList.get(cacheKey);
  if (existing) return existing;

  const request = (async () => {
    const supabase = getSupabaseClient();
    let query = supabase
      .from('products')
      .select(PRODUCT_CARD_COLUMNS)
      .eq('is_active', true);

    if (search) {
      query = query.or(`name_en.ilike.%${search}%,name_bn.ilike.%${search}%`);
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    if (sortBy === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'rating_desc') {
      query = query.order('avg_rating', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;

    const mapped = ((data || []) as SupabaseProductRow[]).map(mapProductRow);
    seedCatalogProducts(mapped, cacheKey);
    return mapped;
  })();

  inFlightList.set(cacheKey, request);
  try {
    return await request;
  } finally {
    inFlightList.delete(cacheKey);
  }
}

export function getInstantCategories(): { categories: CategoryItem[]; fresh: boolean } {
  if (categoriesCache && categoriesCache.data.length > 0) {
    return { categories: categoriesCache.data, fresh: isCacheFresh(categoriesCache.timestamp, 5 * 60 * 1000) };
  }
  const sess = readSessionCache<CategoryItem[]>(SESSION_CATEGORIES_KEY);
  if (sess && sess.data.length > 0) {
    categoriesCache = sess;
    return { categories: sess.data, fresh: isCacheFresh(sess.timestamp, 5 * 60 * 1000) };
  }
  return { categories: EPSR_CATEGORIES, fresh: false };
}

export async function fetchCategoriesClient(): Promise<CategoryItem[]> {
  if (inFlightCategories) return inFlightCategories;

  inFlightCategories = (async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id,name_en,name_bn')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return categoriesCache?.data || EPSR_CATEGORIES;
    }

    const mapped: CategoryItem[] = (data as Array<{ id: string; name_en: string; name_bn?: string | null }>).map(
      (c) => ({
        id: c.id,
        nameEn: c.name_en,
        nameBn: c.name_bn || c.name_en,
      })
    );
    categoriesCache = { data: mapped, timestamp: Date.now() };
    writeSessionCache(SESSION_CATEGORIES_KEY, mapped);
    return mapped;
  })();

  try {
    return await inFlightCategories;
  } finally {
    inFlightCategories = null;
  }
}
