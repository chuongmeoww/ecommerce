// src/pages/Cart.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getCart as getItems,
  updateQty,
  removeItem,
  clearCart,
  totalPrice,
} from '../services/cart';

function CartItem({ item, onQty, onRemove }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b">
      <img
        src={item.image || 'https://via.placeholder.com/80x100?text=No+Image'}
        alt={item.name}
        className="w-20 h-24 object-cover rounded border"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{item.name}</div>
        <div className="text-sm text-gray-500">
          {item.size ? `Size: ${item.size}` : ''} {item.color ? `• ${item.color}` : ''}
        </div>
        <div className="mt-1 text-red-600 font-semibold">
          {Number(item.price).toLocaleString()}₫
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 border rounded"
          onClick={() => onQty(item.id, Math.max(1, (item.qty || 1) - 1))}
        >−</button>
        <input
          className="w-12 text-center border rounded py-1"
          value={item.qty}
          onChange={(e) => onQty(item.id, Math.max(1, parseInt(e.target.value) || 1))}
          inputMode="numeric"
        />
        <button
          className="px-3 py-1 border rounded"
          onClick={() => onQty(item.id, (item.qty || 1) + 1)}
        >+</button>
      </div>
      <button
        className="ml-2 text-sm text-gray-500 hover:text-red-600"
        onClick={() => onRemove(item.id)}
      >
        Xoá
      </button>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [sum, setSum] = useState(0);

  const reload = () => {
    const its = getItems();
    setItems(its);
    setSum(totalPrice());
  };

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener('cart_changed', handler);
    return () => window.removeEventListener('cart_changed', handler);
  }, []);

  const onQty = (id, qty) => {
    updateQty(id, qty);
    reload();
  };
  const onRemove = (id) => {
    removeItem(id);
    reload();
  };
  const onClear = () => {
    if (confirm('Xoá toàn bộ giỏ hàng?')) {
      clearCart();
      reload();
    }
  };

  const goCheckout = () => {
    // ⚠️ Nếu đặt trong form, nhớ type="button" để tránh submit!
    navigate('/checkout'); // ✅ chuyển trang ngay
  };

  const empty = items.length === 0;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Giỏ hàng</h1>

      {empty ? (
        <div className="border rounded-lg p-6 text-center">
          <p className="text-gray-600">Giỏ của bạn đang trống.</p>
          <Link to="/collection" className="inline-block mt-3 px-4 py-2 border rounded hover:bg-gray-50">
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 border rounded-lg p-3">
            {items.map((it) => (
              <CartItem key={it.id} item={it} onQty={onQty} onRemove={onRemove} />
            ))}
            <div className="flex justify-between pt-3">
              <button className="text-sm text-gray-500 hover:text-black" onClick={onClear}>
                Xoá toàn bộ
              </button>
              <Link to="/collection" className="text-sm text-gray-500 hover:text-black">
                Tiếp tục mua sắm →
              </Link>
            </div>
          </div>

          <div className="border rounded-lg p-4 h-max sticky top-24">
            <div className="flex items-center justify-between">
              <div className="font-medium">Tạm tính</div>
              <div className="font-semibold">{Number(sum).toLocaleString()}₫</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Chưa bao gồm phí vận chuyển.</p>

            <button
              type="button"
              onClick={goCheckout}
              disabled={empty}
              className="mt-4 w-full px-4 py-3 rounded-xl bg-black text-white font-medium hover:opacity-90 disabled:opacity-50"
            >
              Tiến hành thanh toán
            </button>

            {/* Hoặc dùng Link nếu thích */}
            {/* <Link
              to="/checkout"
              className={`mt-4 block text-center w-full px-4 py-3 rounded-xl border font-medium hover:bg-gray-50 ${empty ? 'pointer-events-none opacity-50' : ''}`}
            >
              Tiến hành thanh toán
            </Link> */}
          </div>
        </div>
      )}
    </div>
  );
}
