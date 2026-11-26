'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard, Product } from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/LoadingSkeleton';
import { useLanguage } from '../../context/LanguageContext';
import { trackPageView, trackSearch } from '../../lib/analytics';
import {
  EPSR_CATEGORIES,
  fetchCategoriesClient,
  fetchFilteredProductsClient,
  getCachedProductList,
  getInstantCategories,
  type CategoryItem,
} from '../../lib/catalog';
import { Filter, Search } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadedKey, setLoadedKey] = useState<string>('');
  const [categories, setCategories] = useState<CategoryItem[]>(EPSR_CATEGORIES);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [sortBy, setSortBy] = useState('newest');

  const cleanSearch = debouncedSearch.trim();
  const requestKey = `list:${selectedCategory}:${sortBy}:${cleanSearch.toLowerCase()}`;
  const loading = loadedKey !== requestKey;

  // Debounce search typing to avoid redundant Supabase roundtrips per keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 220);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    trackPageView('/products');
    let active = true;

    const loadCats = async () => {
      await Promise.resolve();
      const cachedCats = getInstantCategories();
      if (active && cachedCats.categories.length > 0) {
        setCategories(cachedCats.categories);
        if (cachedCats.fresh) return;
      }

      try {
        const cats = await fetchCategoriesClient();
        if (active && cats.length > 0) setCategories(cats);
      } catch {
        // Keep default instant categories
      }
    };

    void loadCats();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadFilteredProducts = async () => {
      await Promise.resolve();
      const cached = getCachedProductList(requestKey);
      if (active && cached) {
        setProducts(cached.products);
        setLoadedKey(requestKey);
        if (cached.fresh) return;
      }

      try {
        const list = await fetchFilteredProductsClient({
          search: cleanSearch,
          categoryId: selectedCategory,
          sortBy,
        });
        if (!active) return;
        if (cleanSearch) {
          trackSearch(cleanSearch, list.length);
        }
        setProducts(list);
      } catch {
        if (active && !cached) setProducts([]);
      } finally {
        if (active) setLoadedKey(requestKey);
      }
    };

    void loadFilteredProducts();
    return () => {
      active = false;
    };
  }, [cleanSearch, requestKey, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Filter / Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3 md:space-y-0 md:flex md:flex-wrap md:items-center md:justify-between md:gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1 md:min-w-[220px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'পণ্য খুঁজুন...' : 'Search groceries...'}
            className="w-full pl-9 pr-4 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#F48721]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-2 sm:py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
              selectedCategory === ''
                ? 'bg-[#F48721] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {language === 'bn' ? 'সবগুলো' : 'All'}
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? '' : cat.id)}
                className={`px-3.5 py-2 sm:py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                  isSelected
                    ? 'bg-[#F48721] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto text-base sm:text-xs font-semibold py-2 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#F48721]"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="font-bold text-gray-800 text-base">No products found</h3>
          <p className="text-xs text-gray-500 mt-1">Try modifying your search or filter keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
