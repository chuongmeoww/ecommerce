import ProductCard from './ProductCard';

export default function ProductGrid({ items }) {
  if (!items?.length) {
    return <div className="text-slate-500">Chưa có sản phẩm.</div>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map(p => <ProductCard key={p._id || p.slug} product={p} />)}
    </div>
  );
}