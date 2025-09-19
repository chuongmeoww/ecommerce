// frontend/src/pages/admin/AdminOrdersList.jsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminFetchOrders } from '../../services/adminOrders';

const STATUS = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipped', label: 'Đã gửi' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'refunded', label: 'Hoàn tiền' },
];

export default function AdminOrdersList() {
  const [params, setParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: 20, total: 0 });
  const [stats, setStats] = useState({ totalRevenue: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  const page = Number(params.get('page') || 1);
  const q = params.get('q') || '';
  const status = params.get('status') || '';
  const sort = params.get('sort') || 'latest';

  const setParam = (k, v) => {
    if (v) params.set(k, v); else params.delete(k);
    params.set('page', '1');
    setParams(params);
  };
  const gotoPage = (p) => { params.set('page', String(p)); setParams(params); };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { items, pagination, stats } = await adminFetchOrders({ page, q, status, sort });
        setRows(items || []);
        setPageInfo(pagination || { page: 1, limit: 20, total: 0 });
        setStats(stats || { totalRevenue: 0, count: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [page, q, status, sort]);

  const totalPages = Math.max(1, Math.ceil((pageInfo.total || 0) / (pageInfo.limit || 20)));

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Đơn hàng</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <input
          placeholder="Tìm (mã đơn, tên, sđt, email)"
          defaultValue={q}
          onKeyDown={(e) => { if (e.key === 'Enter') setParam('q', e.currentTarget.value); }}
          className="px-3 py-2 border rounded"
        />
        <select className="px-3 py-2 border rounded" value={status} onChange={(e) => setParam('status', e.target.value)}>
          {STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="px-3 py-2 border rounded" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
          <option value="latest">Mới nhất</option>
          <option value="amount_desc">Tổng tiền ↓</option>
          <option value="amount_asc">Tổng tiền ↑</option>
          <option value="status">Trạng thái</option>
        </select>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <div>Tổng đơn: <b>{pageInfo.total || 0}</b></div>
        <div>Doanh thu lọc: <b>{Number(stats.totalRevenue || 0).toLocaleString()}₫</b></div>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Mã</th>
              <th className="p-2 text-left">Khách</th>
              <th className="p-2 text-right">Tổng</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Thanh toán</th>
              <th className="p-2">Ngày</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">Đang tải…</td></tr>
            ) : rows.length ? rows.map(o => (
              <tr key={o._id} className="border-t">
                <td className="p-2 font-medium">{o.code || o._id.slice(-6)}</td>
                <td className="p-2">
                  <div className="truncate max-w-[220px]">
                    {o.shippingAddress?.fullName || '—'}
                    <div className="text-xs text-gray-500">{o.shippingAddress?.phone || '—'}</div>
                  </div>
                </td>
                <td className="p-2 text-right">{Number(o.total || 0).toLocaleString()}₫</td>
                <td className="p-2 text-center">
                  <span className="px-2 py-1 rounded bg-gray-100">{o.status}</span>
                </td>
                <td className="p-2 text-center">
                  {o.paid ? <span className="text-green-600">Đã thu</span> : <span className="text-orange-600">Chưa thu</span>}
                </td>
                <td className="p-2 text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-2 text-right">
                  <Link to={`/admin/orders/${o._id}`} className="px-3 py-1.5 border rounded hover:bg-gray-50">Xem</Link>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">Không có đơn phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <button className="px-3 py-2 border rounded disabled:opacity-50" disabled={page <= 1} onClick={() => gotoPage(page - 1)}>Trước</button>
        <div>Trang <b>{page}</b> / {totalPages}</div>
        <button className="px-3 py-2 border rounded disabled:opacity-50" disabled={page >= totalPages} onClick={() => gotoPage(page + 1)}>Sau</button>
      </div>
    </div>
  );
}
