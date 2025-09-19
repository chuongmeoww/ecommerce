// src/pages/Cart.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateQty, removeItem, clearCart, totalPrice } from '../services/cart';

export default function Cart() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);

  const subtotal = useMemo(() => totalPrice(), [items]);
  const shipping = 0; // demo: miễn phí
  const grand = subtotal + shipping;

  useEffect(() => {
    setItems(getCart());
    const onChange = () => setItems(getCart());
    window.addEventListener('storage', onChange);
    window.addEventListener('cart_changed', onChange);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('cart_changed', onChange);
    };
  }, []);

  const onQty = (id, q) => setItems(updateQty(id, q));
  const onRemove = (id) => setItems(removeItem(id));
  const onClear = () => { clearCart(); setItems([]); };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Giỏ hàng</h1>

      {!items.length ? (
        <div className="rounded-xl border p-6 text-center text-gray-600">
          Giỏ hàng trống. <Link to="/collection" className="underline">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left p-3">Sản phẩm</th>
                    <th className="text-right p-3 w-24">Giá</th>
                    <th className="text-center p-3 w-36">Số lượng</th>
                    <th className="text-right p-3 w-28">Tạm tính</th>
                    <th className="p-3 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id} className="border-t">
                      <td className="p-3">
                        <div className="flex gap-3">
                          <div className="w-16 h-20 bg-neutral-100 rounded overflow-hidden">
                            {it.image && <img src={it.image} alt={it.name} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <Link to={`/product/${it.slug}`} className="font-medium hover:underline">{it.name}</Link>
                            {it.size && <div className="text-xs text-gray-500 mt-0.5">Size: {it.size}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">{Number(it.price).toLocaleString()}₫</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center border rounded-lg overflow-hidden">
                          <button className="px-2 py-1 hover:bg-gray-50" onClick={() => onQty(it.id, it.qty - 1)}>−</button>
                          <input
                            value={it.qty}
                            onChange={(e) => onQty(it.id, parseInt(e.target.value) || 1)}
                            className="w-12 text-center outline-none"
                            inputMode="numeric"
                          />
                          <button className="px-2 py-1 hover:bg-gray-50" onClick={() => onQty(it.id, it.qty + 1)}>+</button>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        {(Number(it.price) * Number(it.qty)).toLocaleString()}₫
                      </td>
                      <td className="p-3 text-center">
                        <button className="text-red-600 hover:underline" onClick={() => onRemove(it.id)}>Xoá</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <Link to="/collection" className="px-3 py-2 border rounded-lg hover:bg-gray-50">← Tiếp tục mua sắm</Link>
              <button onClick={onClear} className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-red-600">
                Xoá tất cả
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border p-4 bg-white">
              <h2 className="text-lg font-semibold mb-3">Thanh toán</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <b>{subtotal.toLocaleString()}₫</b>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{shipping ? `${shipping.toLocaleString()}₫` : 'Miễn phí'}</span>
                </div>
                <hr />
                <div className="flex justify-between text-base">
                  <span>Tổng</span>
                  <b>{grand.toLocaleString()}₫</b>
                </div>
              </div>
              <button
                onClick={() => { alert('Demo: chuyển sang /checkout'); /* nav('/checkout') */ }}
                className="mt-4 w-full px-4 py-3 rounded-xl bg-black text-white font-medium hover:opacity-90"
              >
                Tiến hành thanh toán
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Bằng cách đặt hàng, bạn đồng ý với điều khoản mua hàng của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
