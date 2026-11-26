import React, { Suspense } from 'react';
import { HomeClient } from '../components/HomeClient';
import { getCachedHomeProducts } from '../lib/catalog-server';

async function HomeData() {
  const { products, fetched } = await getCachedHomeProducts();
  return <HomeClient initialProducts={products} initialFetched={fetched} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeClient initialProducts={[]} initialFetched={false} />}>
      <HomeData />
    </Suspense>
  );
}
