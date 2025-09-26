// src/pages/Cart.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cart from '../services/cart';

const fmt = (n) => (Number(n || 0)).toLocaleString('vi-VN') + '₫';

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(cart.getItems());
    const onChange = () => setItems(cart.getItems());
    window.addEventListener('cart_changed', onChange);
    return () => window.removeEventListener('cart_changed', onChange);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0),
    [items]
  );

  const updateQty = (id, qty) => {
    cart.updateQty(id, qty);
  };
  const remove = (id) => cart.removeItem(id);

  if (items.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">Giỏ hàng</h1>
        <div className="rounded-2xl border bg-white p-8 text-center">
          <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
          <Link to="/collection" className="btn-primary">Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
      {/* List */}
      <div className="lg:col-span-2 rounded-2xl border bg-white">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Giỏ hàng</h1>
          <span className="text-sm text-gray-500">{items.length} sản phẩm</span>
        </div>

        <ul className="divide-y">
          {items.map((it) => (
            <li key={it.id} className="p-5 flex items-center gap-4">
              <img
                src={it.image}
                alt={it.name}
                className="w-20 h-24 rounded-xl border object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/product/${it.slug}`} className="font-medium line-clamp-1 hover:underline">
                      {it.name}
                    </Link>
                    <div className="text-xs text-gray-500 mt-1">
                      {[it.size, it.color, it.sku].filter(Boolean).join(' · ') || '—'}
                    </div>
                  </div>
                  <div className="font-semibold whitespace-nowrap">{fmt(it.price)}</div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center border rounded-xl overflow-hidden">
                    <button
                      className="px-3 py-2 hover:bg-gray-50"
                      onClick={() => updateQty(it.id, Math.max(1, (it.qty || 1) - 1))}
                    >
                      −
                    </button>
                    <input
                      className="w-12 text-center outline-none"
                      value={it.qty}
                      onChange={(e) => {
                        const v = Math.max(1, parseInt(e.target.value) || 1);
                        updateQty(it.id, v);
                      }}
                      inputMode="numeric"
                    />
                    <button
                      className="px-3 py-2 hover:bg-gray-50"
                      onClick={() => updateQty(it.id, (it.qty || 1) + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-sm text-gray-500 hover:text-red-600"
                    onClick={() => remove(it.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary */}
      <aside className="rounded-2xl border bg-white p-5 h-fit sticky top-20">
        <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn</h2>

        <div className="space-y-2 text-sm">
          <Row label="Tạm tính" value={fmt(subtotal)} />
          <Row label="Giảm giá" value={fmt(0)} />
          <Row label="Phí vận chuyển" value="Tính ở bước sau" />
          <div className="border-t pt-3" />
          <RowStrong label="Tổng cộng" value={fmt(subtotal)} />
        </div>

        <button
          className="btn-primary w-full mt-4"
          onClick={() => navigate('/checkout')}
        >
          Tiến hành thanh toán
        </button>

        <Link to="/collection" className="btn-ghost w-full mt-2 text-center">
          Tiếp tục mua sắm
        </Link>
      </aside>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span>{value}</span>
    </div>
  );
}
function RowStrong({ label, value }) {
  return (
    <div className="flex items-center justify-between text-base">
      <span className="font-semibold">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
