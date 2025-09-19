// src/pages/ProductDetail.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { addItem as addToCart } from '../services/cart';

const imgOf = (im) => (typeof im === 'string' ? im : im?.url);
function discountPct(base, sale) {
  if (!base || !sale || sale >= base) return null;
  const pct = Math.round(((base - sale) / base) * 100);
  return pct > 0 ? pct : null;
}
function finalUnitPrice(product, variant) {
  if (variant?.price && variant.price > 0) return variant.price;
  if (product?.salePrice && product.salePrice > 0) return product.salePrice;
  return product?.price || 0;
}
function basePrice(product, variant) {
  return product?.price || variant?.price || 0;
}
function deriveOptions(product) {
  const vs = Array.isArray(product?.variants) ? product.variants : [];
  const colors = [...new Set(vs.map(v => v.color).filter(Boolean))];
  const sizesFromVariants = [...new Set(vs.map(v => v.size).filter(Boolean))];
  const sizes = sizesFromVariants.length ? sizesFromVariants : (Array.isArray(product?.sizes) ? product.sizes : []);
  return { colors, sizes, variants: vs };
}
function inStock(product, variant) {
  if (variant) return (variant.stock || 0) > 0;
  const vs = Array.isArray(product?.variants) ? product.variants : [];
  if (vs.length) return vs.some(v => (v.stock || 0) > 0);
  return (product?.stock || 0) > 0;
}

function PriceBlock({ product, variant }) {
  const unit = finalUnitPrice(product, variant);
  const base = basePrice(product, variant);
  const pct = base > unit ? discountPct(base, unit) : null;
  return (
    <div className="flex items-baseline gap-2">
      <div className="text-2xl font-bold text-red-600">{Number(unit).toLocaleString()}₫</div>
      {base > unit && (
        <>
          <div className="line-through text-gray-500">{Number(base).toLocaleString()}₫</div>
          {pct ? <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-semibold">-{pct}%</span> : null}
        </>
      )}
    </div>
  );
}

function Gallery({ images = [] }) {
  const [idx, setIdx] = useState(0);
  const src = imgOf(images[idx]) || imgOf(images[0]);
  if (!images?.length) return <div className="w-full aspect-[4/5] bg-neutral-100 rounded-xl" />;
  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="hidden md:flex md:flex-col gap-3 col-span-2">
        {images.map((im, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`rounded-lg overflow-hidden border ${i === idx ? 'ring-2 ring-black' : ''}`}
            aria-label={`thumb ${i + 1}`}
          >
            <div className="aspect-square bg-neutral-100">
              <img src={imgOf(im)} alt={`thumb-${i}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </button>
        ))}
      </div>
      <div className="col-span-12 md:col-span-10">
        <div className="rounded-xl overflow-hidden border bg-white">
          <div className="w-full aspect-[4/5] bg-neutral-100">
            <img src={src} alt="product" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:hidden mt-3 overflow-x-auto flex gap-2 snap-x">
          {images.map((im, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`min-w-[28%] rounded-lg overflow-hidden border snap-start ${i === idx ? 'ring-2 ring-black' : ''}`}
            >
              <div className="aspect-square bg-neutral-100">
                <img src={imgOf(im)} alt={`thumb-${i}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useState(items?.[0]?.key || null);
  return (
    <div className="divide-y rounded-lg border bg-white">
      {items.map((it) => (
        <div key={it.key}>
          <button
            onClick={() => setOpen(o => (o === it.key ? null : it.key))}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
          >
            <span className="font-medium">{it.title}</span>
            <span className="text-xl">{open === it.key ? '−' : '+'}</span>
          </button>
          {open === it.key && (
            <div className="px-4 pb-4 text-sm text-gray-700">
              {typeof it.content === 'string' ? <p>{it.content}</p> : it.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RatingSummary({ product, localReviews }) {
  const reviews = product?.reviews || [];
  const all = [...reviews, ...localReviews];
  const count = all.length;
  const avg = count ? all.reduce((s, r) => s + (r.rating || 0), 0) / count : 0;
  return (
    <div className="flex items-center gap-2">
      <StarRating value={avg} readOnly size={18} />
      <span className="text-sm text-gray-600">{count ? `${avg.toFixed(1)} / 5 (${count})` : 'Chưa có đánh giá'}</span>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [p, setP] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const { colors, sizes, variants } = useMemo(() => deriveOptions(p || {}), [p]);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);

  const [localReviews, setLocalReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, name: '', content: '' });

  const images = p?.images?.length
    ? p.images
    : [{ url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop' }];

  const selectedVariant = useMemo(() => {
    if (!variants.length) return null;
    return (
      variants.find(
        v => (color ? v.color === color : true) && (size ? v.size === size : true)
      ) || null
    );
  }, [variants, color, size]);

  // ✅ HOOK này đặt trước mọi return
  const availableSizes = useMemo(() => {
    if (!variants.length || !color) return sizes;
    const set = new Set(
      variants.filter(v => v.color === color && (v.stock || 0) > 0).map(v => v.size)
    );
    return sizes.filter(s => set.has(s));
  }, [variants, color, sizes]);

  const canBuy =
    inStock(p, selectedVariant) &&
    (!variants.length || (size || colors.length === 0));

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${slug}`);
        if (!alive) return;
        setP(data.product);

        const rel = await api.get(`/products/${slug}/related`);
        if (alive) setRelated(rel?.data?.items || []);
      } catch {
        navigate('/collection', { replace: true });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug, navigate]);

  const onAddToCart = () => {
    if (!p) return;
    if (variants.length && !size && sizes.length) {
      alert('Vui lòng chọn size.');
      return;
    }
    if (!inStock(p, selectedVariant)) {
      alert('Sản phẩm tạm hết hàng.');
      return;
    }
    const item = {
      productId: p._id,
      name: p.name,
      slug: p.slug,
      image: imgOf(p.images?.[0]) || '',
      price: finalUnitPrice(p, selectedVariant),
      qty,
      size: size || '',
      color: color || '',
      sku: selectedVariant?.sku || '',
    };
    addToCart(item);
    alert('Đã thêm vào giỏ');
  };

  const submitReview = (e) => {
    e.preventDefault();
    const r = { ...reviewForm, rating: Number(reviewForm.rating) || 5, createdAt: new Date().toISOString() };
    if (!r.name || !r.content) return alert('Vui lòng nhập tên và nội dung đánh giá.');
    setLocalReviews(prev => [r, ...prev]);
    setReviewForm({ rating: 5, name: '', content: '' });
  };

  // ====== return chỉ nằm sau tất cả hooks ======
  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border overflow-hidden">
            <div className="w-full aspect-[4/5] bg-neutral-200 animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-neutral-200 rounded w-3/4 animate-pulse" />
            <div className="h-5 bg-neutral-200 rounded w-1/2 animate-pulse" />
            <div className="h-10 bg-neutral-200 rounded w-1/3 animate-pulse" />
            <div className="h-24 bg-neutral-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  if (!p) return null;

  const breadcrumbs = [
    { to: '/', label: 'Trang chủ' },
    p.category ? { to: `/collection?category=${p.category}`, label: p.category } : null,
    { label: p.name },
  ].filter(Boolean);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      {/* breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-3">
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((b, i) => (
            <li key={i} className="flex items-center gap-2">
              {b.to ? <Link to={b.to} className="hover:underline">{b.label}</Link> : <span>{b.label}</span>}
              {i < breadcrumbs.length - 1 && <span className="text-gray-400">/</span>}
            </li>
          ))}
        </ol>
      </nav>

      {/* main */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        <div className="md:sticky md:top-24 h-max">
          <Gallery images={images} />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">{p.name}</h1>
          {p.brand && <div className="mt-1 text-gray-500 text-sm">Thương hiệu: {p.brand}</div>}

          <div className="mt-2"><RatingSummary product={p} localReviews={localReviews} /></div>
          <div className="mt-3"><PriceBlock product={p} variant={selectedVariant} /></div>

          {!!colors.length && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Chọn màu</div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const anyStock = variants.some(v => v.color === c && (v.stock || 0) > 0);
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c === color ? '' : c)}
                      disabled={!anyStock}
                      className={`px-3 py-1.5 rounded border ${color === c ? 'bg-black text-white' : 'hover:bg-gray-50'} disabled:opacity-40`}
                      title={anyStock ? c : `${c} (hết hàng)`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!!sizes.length && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium mb-2">Chọn size</div>
                <a href="#size-guide" onClick={(e) => e.preventDefault()} className="text-xs text-gray-600 hover:text-black">
                  Hướng dẫn chọn size
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const enabled = !color
                    ? (variants.length ? variants.some(v => v.size === s && (v.stock || 0) > 0) : true)
                    : availableSizes.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(prev => (prev === s ? '' : s))}
                      disabled={!enabled}
                      className={`px-3 py-1.5 rounded border ${size === s ? 'bg-black text-white' : 'hover:bg-gray-50'} disabled:opacity-40`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button className="px-3 py-2 hover:bg-gray-50" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <input
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center outline-none"
                inputMode="numeric"
              />
              <button className="px-3 py-2 hover:bg-gray-50" onClick={() => setQty(q => q + 1)}>+</button>
            </div>

            <button onClick={onAddToCart} disabled={!canBuy} className="flex-1 px-4 py-3 rounded-xl bg-black text-white font-medium hover:opacity-90 disabled:opacity-50">Thêm vào giỏ</button>
            <button onClick={() => { onAddToCart(); navigate('/cart'); }} disabled={!canBuy} className="px-4 py-3 rounded-xl border font-medium hover:bg-gray-50 disabled:opacity-50">Mua ngay</button>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border p-3"><div className="font-medium">Giao nhanh</div><div className="text-gray-600">2–4 ngày toàn quốc</div></div>
            <div className="rounded-xl border p-3"><div className="font-medium">Đổi trả 7 ngày</div><div className="text-gray-600">Đổi size, lỗi kỹ thuật</div></div>
            <div className="rounded-xl border p-3"><div className="font-medium">Thanh toán</div><div className="text-gray-600">COD / Chuyển khoản</div></div>
          </div>

          <div className="mt-6 space-y-3">
            <Accordion
              items={[
                { key: 'desc', title: 'Mô tả sản phẩm', content: p.description || 'Đang cập nhật mô tả chi tiết.' },
                {
                  key: 'specs', title: 'Thông số & chất liệu',
                  content: (
                    <ul className="list-disc ml-5 space-y-1">
                      {Array.isArray(p.specs) && p.specs.length ? (
                        p.specs.map((s, i) => <li key={i}>{s}</li>)
                      ) : (
                        <>
                          <li>Chất liệu: Cotton/Poly tuỳ phiên bản</li>
                          <li>Phom: Regular / Slim</li>
                          <li>HDSD: Giặt máy nhẹ, không tẩy, ủi nhiệt độ thấp</li>
                        </>
                      )}
                    </ul>
                  ),
                },
                { key: 'ship', title: 'Vận chuyển & đổi trả', content: 'Giao 2–4 ngày toàn quốc. Đổi trả 7 ngày (chưa sử dụng, còn tag).' },
              ]}
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Đánh giá</h3>
              <RatingSummary product={p} localReviews={localReviews} />
            </div>

            <form onSubmit={submitReview} className="rounded-xl border p-3 grid md:grid-cols-5 gap-3 bg-white">
              <div className="md:col-span-3 grid gap-3">
                <input
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm(f => ({ ...f, name: e.target.value }))}
                  className="border rounded-lg px-3 py-2"
                  placeholder="Tên của bạn"
                />
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm(f => ({ ...f, content: e.target.value }))}
                  className="border rounded-lg px-3 py-2 min-h-[88px]"
                  placeholder="Cảm nhận sản phẩm..."
                />
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-600 mb-1">Chấm sao</div>
                <StarRating value={reviewForm.rating} onChange={(v) => setReviewForm(f => ({ ...f, rating: v }))} />
                <button className="mt-3 w-full px-4 py-2 rounded-xl bg-black text-white font-medium hover:opacity-90">Gửi đánh giá</button>
                <p className="text-xs text-gray-500 mt-2">(* Demo UI — sẽ nối API reviews sau)</p>
              </div>
            </form>

            <div className="mt-3 space-y-3">
              {[...(p.reviews || []), ...localReviews].map((r, i) => (
                <div key={i} className="rounded-xl border p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.name || 'Khách'}</div>
                    <StarRating value={r.rating} readOnly size={16} />
                  </div>
                  <div className="text-sm text-gray-700 mt-1 whitespace-pre-line">{r.content}</div>
                  {r.createdAt && <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>}
                </div>
              ))}
              {!((p.reviews || []).length || localReviews.length) && (
                <div className="text-sm text-gray-500">Chưa có đánh giá.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* related */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl md:text-2xl font-semibold">Sản phẩm liên quan</h2>
          {p.category && (
            <Link to={`/collection?category=${p.category}`} className="text-sm text-neutral-600 hover:text-black">
              Xem tất cả
            </Link>
          )}
        </div>
        {related?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {related.map((r) => <ProductCard key={r._id || r.slug} product={r} />)}
          </div>
        ) : (
          <div className="text-sm text-neutral-500">Chưa có gợi ý phù hợp.</div>
        )}
      </div>
    </div>
  );
}
