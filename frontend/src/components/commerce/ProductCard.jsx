import { Link } from "react-router-dom";
import { fmt, discountPct } from "../../utils/money";
import { imgOf } from "../../utils/img";

export default function ProductCard({ product }) {
  const price = product?.salePrice > 0 ? product.salePrice : product?.price || 0;
  const pct = discountPct(product?.price, product?.salePrice);
  return (
    <Link to={`/product/${product.slug}`} className="border rounded-lg overflow-hidden bg-white hover:shadow">
      <div className="aspect-[4/5] bg-neutral-100">
        <img src={imgOf(product?.images?.[0])} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <div className="line-clamp-2 text-sm">{product.name}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className="font-semibold">{fmt(price)}</div>
          {pct ? <div className="text-xs text-red-600 font-medium">-{pct}%</div> : null}
        </div>
      </div>
    </Link>
  );
}
