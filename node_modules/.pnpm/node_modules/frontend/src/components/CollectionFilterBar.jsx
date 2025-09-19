// src/components/CollectionFilterBar.jsx
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SORTS = [
  { value: 'featured',   label: 'Nổi bật' },
  { value: 'sold_desc',  label: 'Bán chạy' },
  { value: 'latest',     label: 'Mới nhất' },
  { value: 'price_asc',  label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'a_z',        label: 'A → Z' },
  { value: 'z_a',        label: 'Z → A' },
];

const COLLECTIONS = [
  { value: '',              label: 'Tất cả BST' },
  { value: 'the-beginner',  label: 'The Beginner' },
  { value: 'the-trainer',   label: 'The Trainer' },
];

function useDebounced(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function CollectionFilterBar() {
  const [params, setParams] = useSearchParams();

  const [q, setQ] = useState(params.get('q') || '');
  const [minPrice, setMinPrice] = useState(params.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
  const [inStock, setInStock] = useState(params.get('inStock') === '1');

  const sort = params.get('sort') || 'featured';
  const collection = params.get('collection') || '';
  const debQ = useDebounced(q);

  // sync URL khi q debounce thay đổi
  useEffect(() => {
    if (debQ) params.set('q', debQ);
    else params.delete('q');
    params.set('page', '1');
    setParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debQ]);

  const clearFilters = () => {
    const keep = ['category']; // giữ category nếu có
    for (const key of Array.from(params.keys())) {
      if (!keep.includes(key)) params.delete(key);
    }
    setParams(params);
    setQ('');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
  };

  const applyPrice = () => {
    if (minPrice) params.set('minPrice', String(minPrice)); else params.delete('minPrice');
    if (maxPrice) params.set('maxPrice', String(maxPrice)); else params.delete('maxPrice');
    params.set('page', '1');
    setParams(params);
  };

  const toggleInStock = () => {
    const next = !inStock;
    setInStock(next);
    if (next) params.set('inStock', '1'); else params.delete('inStock');
    params.set('page', '1');
    setParams(params);
  };

  const setParam = (key, val) => {
    if (val) params.set(key, val); else params.delete(key);
    params.set('page', '1');
    setParams(params);
  };

  const activeCount = useMemo(() => {
    let n = 0;
    if (params.get('q')) n++;
    if (params.get('minPrice') || params.get('maxPrice')) n++;
    if (params.get('inStock') === '1') n++;
    if (params.get('sort') && params.get('sort') !== 'featured') n++;
    if (params.get('collection')) n++;
    return n;
  }, [params]);

  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm…"
            className="px-3 py-2 w-44 md:w-72 focus:outline-none"
          />
          <div className="px-3 py-2 bg-gray-50 text-gray-600 border-l">Enter</div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Giá từ"
            className="px-3 py-2 w-28 border rounded-lg"
          />
          <span className="text-gray-500">-</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="đến"
            className="px-3 py-2 w-28 border rounded-lg"
          />
          <button onClick={applyPrice} className="px-3 py-2 border rounded-lg hover:bg-gray-50">
            Áp dụng
          </button>
        </div>

        {/* In stock */}
        <label className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer">
          <input type="checkbox" checked={inStock} onChange={toggleInStock} />
          <span>Còn hàng</span>
        </label>

        {/* Collection */}
        <select
          className="px-3 py-2 border rounded-lg"
          value={collection}
          onChange={(e) => setParam('collection', e.target.value)}
        >
          {COLLECTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="px-3 py-2 border rounded-lg"
          value={sort}
          onChange={(e) => setParam('sort', e.target.value)}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Clear */}
        <button onClick={clearFilters} className="ml-auto px-3 py-2 border rounded-lg hover:bg-gray-50">
          Xoá lọc {activeCount ? `(${activeCount})` : ''}
        </button>
      </div>
    </div>
  );
}
