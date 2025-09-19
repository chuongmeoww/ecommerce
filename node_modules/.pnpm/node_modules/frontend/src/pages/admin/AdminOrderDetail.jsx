// frontend/src/pages/admin/AdminOrderDetail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminFetchOrder, adminUpdateOrder, adminCancelOrder } from '../../services/adminOrders';

const NEXT_STEPS = ['confirmed','processing','shipped','delivered'];
const ALL_STATUS = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [o, setO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const ord = await adminFetchOrder(id);
      setO(ord);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const updateStatus = async (status) => {
    setBusy(true);
    try {
      const ord = await adminUpdateOrder(id, { status });
      setO(ord);
    } finally {
      setBusy(false);
    }
  };
  const togglePaid = async () => {
    setBusy(true);
    try {
      const ord = await adminUpdateOrder(id, { paid: !o.paid });
      setO(ord);
    } finally {
      setBusy(false);
    }
  };
  const cancel = async () => {
    if (!confirm('Xác nhận hủy đơn này?')) return;
    setBusy(true);
    try {
      const ord = await adminCancelOrder(id);
      setO(ord);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-4">Đang tải…</div>;
  if (!o) return <div className="p-4">Không tìm thấy đơn.</div>;

  const canAdvance = NEXT_STEPS.includes(o.status) ? NEXT_STEPS.slice(NEXT_STEPS.indexOf(o.status) + 1)[0] : 'confirmed';

  return (
    <div className="p-4 space-y-4">
      <button className="px-3 py-1.5 border rounded hover:bg-gray-50" onClick={() => navigate(-1)}>← Quay lại</button>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">Đơn {o.code || o._id.slice(-6)}</h1>
        <span className="px-2 py-1 rounded bg-gray-100">{o.status}</span>
        <span className={`px-2 py-1 rounded ${o.paid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
          {o.paid ? 'ĐÃ THU' : 'CHƯA THU'}
        </span>
      </div>

      {/* Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded p-3 md:col-span-2">
          <div className="font-medium mb-2">Sản phẩm</div>
          <div className="divide-y">
            {o.items.map((it, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-sm text-gray-500">
                    {it.sku ? `SKU: ${it.sku} • ` : ''} {it.size ? `Size ${it.size}` : ''} {it.color ? `• ${it.color}` : ''}
                  </div>
                </div>
                <div className="text-right text-sm">
                  x{it.qty} • {Number(it.price).toLocaleString()}₫
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 text-sm">
            <div>Tạm tính</div><div className="text-right">{Number(o.subtotal || 0).toLocaleString()}₫</div>
            <div>Phí vận chuyển</div><div className="text-right">{Number(o.shippingFee || 0).toLocaleString()}₫</div>
            <div>Giảm</div><div className="text-right">-{Number(o.discount || 0).toLocaleString()}₫</div>
            <div className="col-span-2 border-t my-2"></div>
            <div className="font-semibold">Tổng thanh toán</div><div className="text-right font-semibold">{Number(o.total || 0).toLocaleString()}₫</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="border rounded p-3">
            <div className="font-medium mb-1">Khách hàng</div>
            <div className="text-sm">
              <div>{o.shippingAddress?.fullName || '—'}</div>
              <div className="text-gray-600">{o.shippingAddress?.phone || '—'}</div>
              <div className="text-gray-600">{o.shippingAddress?.email || '—'}</div>
              <div className="text-gray-600">
                {[
                  o.shippingAddress?.line1,
                  o.shippingAddress?.line2,
                  o.shippingAddress?.ward,
                  o.shippingAddress?.district,
                  o.shippingAddress?.city
                ].filter(Boolean).join(', ') || '—'}
              </div>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="font-medium mb-1">Hành động</div>
            <div className="flex flex-wrap gap-2">
              {/* Đánh dấu thanh toán */}
              <button disabled={busy} onClick={togglePaid} className="px-3 py-1.5 border rounded hover:bg-gray-50">
                {o.paid ? 'Đánh dấu CHƯA THU' : 'Đánh dấu ĐÃ THU'}
              </button>

              {/* Cập nhật trạng thái nhanh */}
              <select
                disabled={busy}
                value={o.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="px-3 py-1.5 border rounded"
              >
                {ALL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Tiến một bước gợi ý */}
              {!['delivered','cancelled','refunded'].includes(o.status) && (
                <button disabled={busy} onClick={() => updateStatus(canAdvance)} className="px-3 py-1.5 border rounded hover:bg-gray-50">
                  Tiến tới: {canAdvance}
                </button>
              )}

              {/* Huỷ đơn */}
              {['pending','confirmed','processing','shipped'].includes(o.status) && (
                <button disabled={busy} onClick={cancel} className="px-3 py-1.5 border rounded text-red-600 hover:bg-red-50">
                  Hủy đơn
                </button>
              )}
            </div>
          </div>

          <div className="border rounded p-3 text-sm text-gray-600">
            <div>Đặt lúc: {o.placedAt ? new Date(o.placedAt).toLocaleString() : new Date(o.createdAt).toLocaleString()}</div>
            {o.confirmedAt && <div>Xác nhận: {new Date(o.confirmedAt).toLocaleString()}</div>}
            {o.shippedAt && <div>Gửi hàng: {new Date(o.shippedAt).toLocaleString()}</div>}
            {o.deliveredAt && <div>Giao hàng: {new Date(o.deliveredAt).toLocaleString()}</div>}
            {o.cancelledAt && <div>Hủy: {new Date(o.cancelledAt).toLocaleString()}</div>}
            {o.refundedAt && <div>Hoàn tiền: {new Date(o.refundedAt).toLocaleString()}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
