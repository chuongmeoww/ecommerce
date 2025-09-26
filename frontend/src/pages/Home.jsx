// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { fetchCategories } from '../services/category';
import ProductCard from '../components/ProductCard';
import CategoryPills from '../components/CategoryPills';
import CarouselHero from '../components/CarouselHero';

function Section({ title, action, children }) {
  return (
    <section className="max-w-screen-2xl mx-auto px-4">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ProductsGrid({ items }) {
  if (!items?.length) return <div className="text-neutral-500">Chưa có sản phẩm.</div>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
      {items.map((p) => (
        <ProductCard key={p._id || p.slug} product={p} />
      ))}
    </div>
  );
}

function SkeletonGrid({ count = 18 }) {
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

export default function Home() {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);

  // load categories
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchCategories();
        if (alive) setCats(data);
      } catch (e) {
        console.error('[home] categories error:', e);
        if (alive) setCats([]);
      } finally {
        if (alive) setLoadingCats(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // load products
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Nếu BE đang lọc status=active mặc định và dữ liệu seed chưa set,
        // dùng status=all để nhìn thấy tất cả.
        const { data } = await api.get('/products', {
          params: { sort: 'latest', limit: 24, status: 'all' }
        });
        if (alive) setNewItems(data.items || []);
      } catch (e) {
        console.error('[home] products error:', e);
        if (alive) setNewItems([]);
      } finally {
        if (alive) setLoadingNew(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="space-y-8 md:space-y-10 pb-10">
      <CarouselHero />

      <Section
        title="Danh mục nổi bật"
        action={<Link to="/collection" className="text-sm text-neutral-600 hover:text-black">Xem tất cả</Link>}
      >
        {loadingCats ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border overflow-hidden">
                <div className="aspect-square bg-neutral-200 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <CategoryPills
            categories={cats}
            active=""
            onSelect={(slug) => navigate(`/collection?category=${slug}`)}
          />
        )}
      </Section>

      <Section
        title="Mới về"
        action={<Link to="/collection?sort=latest" className="text-sm text-neutral-600 hover:text-black">Xem thêm</Link>}
      >
        {loadingNew ? <SkeletonGrid count={18} /> : <ProductsGrid items={newItems} />}
      </Section>
    </div>
  );
}
