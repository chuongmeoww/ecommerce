



// src/pages/Collection.jsx
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { fetchCategories } from '../services/category';
import CategoryPills from '../components/CategoryPills';
import ProductCard from '../components/ProductCard';
import CollectionFilterBar from '../components/CollectionFilterBar';

const LIMIT = 24;

// function ProductsGrid({ items }) {
//   if (!items?.length) return <div className="text-neutral-500">Không có sản phẩm phù hợp.</div>;
//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
//       {items.map((p) => <ProductCard key={p._id || p.slug} product={p} />)}
//     </div>
//   );
// }
export function ProductsGrid({ items=[] }) {
  if (!items.length) return <div className="text-neutral-500">Chưa có sản phẩm.</div>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
      {items.map(p => <ProductCard key={p._id || p.slug} product={p} />)}
    </div>
  );
}

function SkeletonGrid({ count = LIMIT }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <div className="w-full aspect-[4/5] bg-neutral-200 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
            <div className="h-3 bg-neutral-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Collection() {
  const [params, setParams] = useSearchParams();
  const [cats, setCats] = useState([]);
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, total: 0, limit: LIMIT });
  const [loading, setLoading] = useState(true);

  const category = params.get('category') || '';
  const collection = params.get('collection') || '';
  const sort = params.get('sort') || 'latest';
  const q = params.get('q') || '';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const page = Number(params.get('page') || 1);

  const totalPages = useMemo(() => {
    const { total, limit } = pageInfo;
    if (!total || !limit) return 1;
    return Math.max(1, Math.ceil(total / limit));
  }, [pageInfo]);

  useEffect(() => {
    (async () => {
      try {
        const cs = await fetchCategories();
        setCats(cs);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data } = await api.get('/products', {
  params: { collection, category, sort, q, minPrice, maxPrice, page, limit: LIMIT },
});
        setItems(data.items || []);
        setPageInfo(data.pagination || { page, total: 0, limit: LIMIT });
      } catch (e) {
        console.error(e);
        setItems([]);
        setPageInfo({ page: 1, total: 0, limit: LIMIT });
      } finally {
        setLoading(false);
      }
    })();
  }, [category, collection, sort, q, minPrice, maxPrice, page]);

  const setParam = (key, val) => {
    if (val) params.set(key, val); else params.delete(key);
    params.set('page', '1');
    setParams(params);
  };
  const gotoPage = (p) => {
    params.set('page', String(p));
    setParams(params);
  };

  return (
    <div className="pb-10">
      <CollectionFilterBar />

      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        {/* Category pills */}
        <div className="mb-4">
          <CategoryPills categories={cats} active={category} onSelect={(slug) => setParam('category', slug)} />
        </div>

        {/* Result */}
        {loading ? <SkeletonGrid /> : <ProductsGrid items={items} />}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            onClick={() => gotoPage(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Trang trước
          </button>
          <div className="text-sm">Trang <b>{page}</b> / {totalPages}</div>
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            onClick={() => gotoPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}
