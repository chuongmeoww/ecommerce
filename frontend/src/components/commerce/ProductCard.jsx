import { Link } from 'react-router-dom';
import Price from './Price';

export default function ProductCard({ product }) {
  const img = product.images?.[0]?.url || product.image;
  return (
    <Link to={`/product/${product.slug}`} className="card overflow-hidden hover:shadow-md transition">
      <div className="w-full aspect-[4/5] bg-slate-100">
        {img && <img src={img} alt={product.name} className="w-full h-full object-cover" loading="lazy" />}
      </div>
      <div className="p-3">
        <div className="text-sm line-clamp-2 min-h-[40px]">{product.name}</div>
        <div className="mt-1"><Price price={product.price} sale={product.salePrice} /></div>
      </div>
    </Link>
  );
}