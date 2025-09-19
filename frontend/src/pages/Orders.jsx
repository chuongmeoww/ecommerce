import { useEffect, useState } from 'react';
import { fetchMyOrders, cancelOrder } from '../services/orders';

const STATUS = {
  pending:   { text: 'Chờ xác nhận',   cls: 'bg-amber-100 text-amber-800' },
  confirmed: { text: 'Đã xác nhận',    cls: 'bg-blue-100 text-blue-800' },
  shipping:  { text: 'Đang giao',      cls: 'bg-cyan-100 text-cyan-800' },
  completed: { text: 'Hoàn tất',       cls: 'bg-emerald-100 text-emerald-700' },
  canceled:  { text: 'Đã hủy',         cls: 'bg-gray-200 text-gray-700' },
};
const fmt = (n) => (Number(n || 0)).toLocaleString('vi-VN') + '₫';

export default function Orders() {
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(true);

  async function load(page = 1) {
    setLoading(true);
    try {
      const { items, pagination } = await fetchMyOrders({ page, limit: 20 });
      setItems(items || []);
      setPageInfo(pagination || { page: 1, limit: 20, total: 0 });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(1); }, []);

  const onCancel = async (id) => {
    if (!window.confirm('Bạn chắc muốn hủy đơn này?')) return;
    try { await cancelOrder(id); await load(pageInfo.page); }
    catch (e) { alert(e?.response?.data?.message || 'Không thể hủy đơn.'); }
  };

  const totalPages = Math.max(1, Math.ceil((pageInfo.total || 0) / (pageInfo.limit || 20)));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Đơn hàng của tôi</h1>

      {loading && <div>Đang tải…</div>}
      {!loading && !items.length && <div className="text-gray-600">Bạn chưa có đơn nào.</div>}

      <div className="space-y-3">
        {items.map(o => {
          const s = STATUS[o.status] || { text: o.status, cls: 'bg-gray-100 text-gray-700' };
          return (
            <div key={o._id} className="border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-medium">#{o.code || o._id}</div>
                <div className="text-sm text-gray-600">
                  {new Date(o.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${s.cls}`}>{s.text}</span>
              <div className="text-right ml-auto">
                <div className="font-semibold">{fmt(o.total)}</div>
                {['pending','confirmed'].includes(o.status) && (
                  <button onClick={() => onCancel(o._id)} className="btn-outline mt-2">Hủy đơn</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button className="btn-outline" onClick={() => load(Math.max(1, pageInfo.page - 1))}
            disabled={pageInfo.page <= 1}>Trước</button>
          <div className="text-sm">Trang <b>{pageInfo.page}</b> / {totalPages}</div>
          <button className="btn-outline" onClick={() => load(Math.min(totalPages, pageInfo.page + 1))}
            disabled={pageInfo.page >= totalPages}>Sau</button>
        </div>
      )}
    </div>
  );
}
