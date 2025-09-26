import { Link } from 'react-router-dom';

function getDiscount(price, sale) {
  if (!price || !sale || sale >= price) return null;
  const pct = Math.round(((price - sale) / price) * 100);
  return pct > 0 ? pct : null;
}
function isNew(createdAt) {
  if (!createdAt) return false;
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 14; // 14 ngày
}

export default function ProductCard({ product }) {
  const img = product?.images?.[0]?.url || product?.image;
  const name = product?.name || "";
  const price = Number(product?.price || 0);
  const sale = Number(product?.salePrice || 0);
  const unit = sale > 0 && sale < price ? sale : price;
  const pct = price > unit ? Math.round(((price - unit) / price) * 100) : 0;

  return (
    <Link
      to={`/product/${product.slug || product._id}`}
      className="group border rounded-xl overflow-hidden bg-white hover:shadow-card transition"
    >
      <div className="relative">
        <div className="w-full aspect-[4/5] bg-neutral-100">
          {img ? (
            <img src={img} alt={name} className="w-full h-full object-cover" loading="lazy" />
          ) : null}
        </div>
        {pct > 0 && (
          <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-brand.red text-white font-semibold">
            -{pct}%
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="text-sm line-clamp-2 group-hover:underline min-h-[36px]">{name}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className="font-semibold text-brand-red">{unit.toLocaleString()}₫</div>
          {pct > 0 && (
            <div className="text-xs line-through text-gray-500">{price.toLocaleString()}₫</div>
          )}
        </div>
      </div>
    </Link>
  );
}