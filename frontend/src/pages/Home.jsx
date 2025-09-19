// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { fetchCategories } from '../services/category';
import ProductCard from '../components/ProductCard';
import CategoryPills from '../components/CategoryPills';
import CarouselHero from '../components/CarouselHero';

function Section({ title, action, children, className = '' }) {
  return (
    <section className={`max-w-screen-2xl mx-auto px-4 ${className}`}>
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
      {items.map((p) => <ProductCard key={p._id || p.slug} product={p} />)}
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchCategories();
        if (mounted) setCats(data);
      } finally {
        if (mounted) setLoadingCats(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/products', { params: { sort: 'latest', limit: 24 } });
        if (mounted) setNewItems(data.items || []);
      } finally {
        if (mounted) setLoadingNew(false);
      }
    })();
    return () => { mounted = false; };
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

      {/* Dải theo ý thích */}
      <Section
        title="Jean bền · Giá mềm"
        action={<Link to="/collection?category=quan-jeans" className="text-sm text-neutral-600 hover:text-black">Xem tất cả</Link>}
      >
        {loadingNew ? <SkeletonGrid count={18} /> : <ProductsGrid items={newItems.slice(0, 18)} />}
      </Section>

      <Section
        title="Sale phụ kiện"
        action={<Link to="/collection?category=phu-kien" className="text-sm text-neutral-600 hover:text-black">Xem tất cả</Link>}
      >
        {loadingNew ? <SkeletonGrid count={18} /> : <ProductsGrid items={newItems.slice(6, 24)} />}
      </Section>
    </div>
  );
}
