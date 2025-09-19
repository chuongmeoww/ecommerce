// // export default function ProductCard({ item }) {
// //   const { name, image, price, salePrice, badge } = item;
// //   const onSale = salePrice && salePrice < price;

// //   return (
// //     <a href={`/product/${item.slug || item.id}`} className="group block h-full">
// //       <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
// //         <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition" />
// //         {onSale && <span className="absolute left-2 top-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-lg">Giảm giá</span>}
// //         {badge && !onSale && <span className="absolute left-2 top-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded-lg">{badge}</span>}
// //       </div>
// //       <div className="mt-2 flex flex-col h-[5.2rem]">
// //         <div className="text-sm text-gray-700 min-h-[2.6rem]">{name}</div>
// //         <div className="mt-auto flex items-center gap-2">
// //           {onSale ? (
// //             <>
// //               <div className="text-red-600 font-semibold">{salePrice.toLocaleString()} VND</div>
// //               <div className="text-gray-400 line-through text-sm">{price.toLocaleString()} VND</div>
// //             </>
// //           ) : (
// //             <div className="text-black font-semibold">{price.toLocaleString()} VND</div>
// //           )}
// //         </div>
// //       </div>
// //     </a>
// //   );
// // }

// // frontend/src/components/ProductCard.jsx
// import { Link } from 'react-router-dom';

// export default function ProductCard({ product }) {
//   const img = product?.images?.[0]?.url;
//   return (
//     <Link
//       to={`/product/${product.slug}`}
//       className="border rounded hover:shadow focus:shadow block"
//       title={product.name}
//     >
//       {img && (
//         <img
//           src={img}
//           alt={product.name}
//           className="w-full h-64 object-cover rounded-t"
//           loading="lazy"
//         />
//       )}
//       <div className="p-3">
//         <div className="font-medium line-clamp-2">{product.name}</div>
//         <div className="text-sm text-gray-600 mt-1">
//           {product.salePrice ? (
//             <>
//               <span className="font-semibold">
//                 {Number(product.salePrice).toLocaleString()}₫
//               </span>
//               {product.price ? (
//                 <span className="line-through ml-2">
//                   {Number(product.price).toLocaleString()}₫
//                 </span>
//               ) : null}
//             </>
//           ) : (
//             <span className="font-semibold">
//               {Number(product.price || 0).toLocaleString()}₫
//             </span>
//           )}
//         </div>
//         {product.brand && (
//           <div className="text-xs text-gray-500 mt-1">{product.brand}</div>
//         )}
//       </div>
//     </Link>
//   );
// }
// src/components/ProductCard.jsx
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
  const img = product?.images?.[0]?.url;
  const pct = getDiscount(product?.price, product?.salePrice);
  const newTag = isNew(product?.createdAt);
  const best = typeof product?.sold === 'number' && product.sold >= 50; // nếu có field sold

  return (
    <Link
      to={`/product/${product.slug}`}
      className="relative flex flex-col bg-white border rounded-lg overflow-hidden hover:shadow transition"
      title={product.name}
    >
      {/* ribbons */}
      <div className="absolute z-10 left-2 top-2 flex flex-col gap-1">
        {pct ? (
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white font-semibold shadow">
            -{pct}%
          </span>
        ) : null}
        {newTag ? (
          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-600 text-white font-semibold shadow">
            New
          </span>
        ) : null}
        {best ? (
          <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-600 text-white font-semibold shadow">
            Best
          </span>
        ) : null}
      </div>

      {/* ảnh cố định tỷ lệ */}
      <div className="w-full aspect-[4/5] bg-neutral-100">
        {img ? <img src={img} alt={product.name} className="w-full h-full object-cover" loading="lazy" /> : null}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <div className="font-medium line-clamp-2 min-h-[2.6rem]">{product.name}</div>

        <div className="mt-auto text-sm">
          {product.salePrice ? (
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-red-600">
                {Number(product.salePrice).toLocaleString()}₫
              </span>
              {product.price ? (
                <span className="line-through text-gray-500">
                  {Number(product.price).toLocaleString()}₫
                </span>
              ) : null}
            </div>
          ) : (
            <span className="font-semibold">
              {Number(product.price || 0).toLocaleString()}₫
            </span>
          )}
        </div>

        {product.brand && <div className="text-xs text-gray-500 mt-1">{product.brand}</div>}
      </div>
    </Link>
  );
}
