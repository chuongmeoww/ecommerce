import { Fragment, useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import cart from '../services/cart';

const fmt = (n) => (Number(n || 0)).toLocaleString('vi-VN') + '₫';

export default function MiniCart({ open, onClose }) {
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

  if (!open) return null;
  return createPortal(
    <Fragment>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Giỏ hàng</h3>
          <button className="text-sm text-gray-500 hover:text-black" onClick={onClose}>Đóng</button>
        </div>

        <div className="flex-1 overflow-auto divide-y">
          {items.length ? items.map(it => (
            <div key={it.id} className="p-4 flex gap-3">
              <img src={it.image} alt={it.name} className="w-16 h-20 rounded-lg border object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/product/${it.slug}`} className="font-medium hover:underline line-clamp-1">
                    {it.name}
                  </Link>
                  <div className="font-semibold whitespace-nowrap">{fmt(it.price)}</div>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {[it.size, it.color].filter(Boolean).join(' · ') || '—'}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="inline-flex items-center border rounded-lg overflow-hidden">
                    <button className="px-2 py-1.5" onClick={() => cart.updateQty(it.id, Math.max(1, it.qty - 1))}>−</button>
                    <span className="w-10 text-center">{it.qty}</span>
                    <button className="px-2 py-1.5" onClick={() => cart.updateQty(it.id, it.qty + 1)}>+</button>
                  </div>
                  <button className="text-xs text-gray-500 hover:text-red-600" onClick={() => cart.removeItem(it.id)}>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-6 text-center text-gray-600">Giỏ hàng trống.</div>
          )}
        </div>

        <div className="p-4 border-t space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tạm tính</span>
            <span className="font-semibold">{fmt(subtotal)}</span>
          </div>
          <button
            className="btn-primary w-full"
            onClick={() => { onClose(); navigate('/checkout'); }}
            disabled={!items.length}
          >
            Thanh toán
          </button>
          <Link to="/cart" className="btn-ghost w-full text-center" onClick={onClose}>
            Xem giỏ hàng
          </Link>
        </div>
      </aside>
    </Fragment>,
    document.body
  );
}
