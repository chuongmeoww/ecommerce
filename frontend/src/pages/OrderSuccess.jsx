import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchOrderById } from '../services/orders';

export default function OrderSuccess() {
  const loc = useLocation();
  const qs = new URLSearchParams(loc.search);
  const id = qs.get('id');
  const code = qs.get('code') || '';
  const [order, setOrder] = useState(null);

  useEffect(() => {
    (async () => {
      if (id) {
        try { setOrder(await fetchOrderById(id)); } catch {}
      }
    })();
  }, [id]);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center">
      <div className="text-3xl font-semibold mb-2">🎉 Đặt hàng thành công</div>
      <div className="text-gray-600 mb-6">
        Mã đơn: <b>{code || order?.code || '—'}</b>
      </div>
      <p className="text-gray-700 mb-8">
        Chúng tôi sẽ liên hệ để xác nhận trong thời gian sớm nhất.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/collections" className="btn-outline">Tiếp tục mua sắm</Link>
        <Link to="/orders" className="btn-primary">Xem đơn hàng</Link>
      </div>
    </div>
  );
}
