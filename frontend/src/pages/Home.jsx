import { useEffect, useState } from 'react';
import Container from '../components/layout/Container';
import ProductGrid from '../components/commerce/ProductGrid';
import api from '../services/api';

export default function Home() {
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try {
        const { data } = await api.get('/products', { params: { sort: 'latest', limit: 12 } });
        setNewItems(data.items || []);
      } finally {
        setLoading(false);
      }
    })();
  },[]);

  return (
    <div>
      <section className="bg-white border-b border-[var(--border)]">
        <Container className="py-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Mặc đẹp mỗi ngày</h1>
              <p className="text-slate-600 mt-2">Sản phẩm mới · Giao nhanh · Giá tốt</p>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1520975922329-c7436017b07c?q=80&w=1600&auto=format&fit=crop" alt="" className="w-full h-full object-cover"/>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8 space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">Mới về</h2>
        </div>
        {loading ? <div className="text-slate-500">Đang tải…</div> : <ProductGrid items={newItems} />}
      </Container>
    </div>
  );
}