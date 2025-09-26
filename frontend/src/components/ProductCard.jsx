import { Link } from "react-router-dom";
import { imgOf } from "../utils/img";

export default function ProductCard({ product }) {
  const cover = imgOf(product?.images?.[0]) || "https://picsum.photos/400/500";
  const price = Number(product.salePrice || product.price || 0);
  const base  = Number(product.price || 0);
  const off   = base>price ? Math.round((base-price)/base*100) : 0;

  return (
    <Link to={`/product/${product.slug}`} className="group border rounded-xl bg-white overflow-hidden hover:shadow-soft transition">
      <div className="aspect-[4/5] bg-gray-100">
        <img src={cover} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
      </div>
      <div className="p-3">
        <div className="text-sm text-gray-500 line-clamp-1">{product.brand || product.collection || "—"}</div>
        <div className="font-medium line-clamp-2 min-h-[3rem]">{product.name}</div>
        <div className="mt-1 flex items-center gap-2">
          <div className="font-semibold text-brand-700">{price.toLocaleString()}₫</div>
          {base>price && <div className="text-xs line-through text-gray-400">{base.toLocaleString()}₫</div>}
          {off>0 && <span className="ml-auto badge-pill border-brand-200 text-brand-700">{off}%</span>}
        </div>
      </div>
    </Link>
  );
}
