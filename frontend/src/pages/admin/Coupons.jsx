// src/pages/admin/Coupons.jsx
import { useEffect, useState } from 'react';
import api, { extractError } from '../../services/api';

const blank = {
  code: '', type: 'percent', value: 10, status: 'active',
  expiresAt: '', usageLimit: '', minOrder: ''
};

export default function Coupons() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true); setErr(null);
    try {
      const { data } = await api.get('/admin/coupons', { params: { q } });
      setRows(data.items ?? data.coupons ?? []);
    } catch (e) { setErr(extractError(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(v => ({ ...v, [name]: value }));
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setForm({
      code: row.code || '',
      type: row.type || 'percent',
      value: row.value ?? 0,
      status: row.status || 'active',
      expiresAt: row.expiresAt ? new Date(row.expiresAt).toISOString().slice(0,16) : '',
      usageLimit: row.usageLimit ?? '',
      minOrder: row.minOrder ?? ''
    });
  };

  const resetForm = () => { setEditingId(null); setForm(blank); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: form.code.trim(),
        type: form.type,
        value: Number(form.value),
        status: form.status,
        expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        minOrder: form.minOrder ? Number(form.minOrder) : undefined,
      };
      if (editingId) await api.patch(`/admin/coupons/${editingId}`, payload);
      else await api.post('/admin/coupons', payload);
      resetForm();
      await load();
    } catch (e2) { alert(extractError(e2).message); }
  };

  const remove = async (id) => {
    if (!confirm('Xoá coupon này?')) return;
    try { await api.delete(`/admin/coupons/${id}`); await load(); }
    catch (e) { alert(extractError(e).message); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Coupons</h1>

      <div className="flex gap-2">
        <input className="input" placeholder="Tìm code/ghi chú" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn-ghost" onClick={load}>Lọc</button>
      </div>

      <form onSubmit={submit} className="card grid grid-cols-1 lg:grid-cols-7 gap-3">
        <input className="input lg:col-span-2" name="code" placeholder="CODE" value={form.code} onChange={onChange} />
        <select className="select" name="type" value={form.type} onChange={onChange}>
          <option value="percent">% phần trăm</option>
          <option value="fixed">Số tiền cố định</option>
        </select>
        <input className="input" type="number" name="value" placeholder="Giá trị" value={form.value} onChange={onChange} />
        <select className="select" name="status" value={form.status} onChange={onChange}>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
        <input className="input" type="datetime-local" name="expiresAt" value={form.expiresAt} onChange={onChange} />
        <div className="flex gap-2">
          <input className="input" type="number" name="usageLimit" placeholder="Giới hạn" value={form.usageLimit} onChange={onChange} />
          <input className="input" type="number" name="minOrder" placeholder="Min order" value={form.minOrder} onChange={onChange} />
        </div>
        <div className="lg:col-span-7">
          <button className="btn-primary" type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
          {editingId && <button type="button" className="btn-ghost ml-2" onClick={resetForm}>Huỷ</button>}
        </div>
      </form>

      {err && <div className="error-text">{err.message}</div>}

      <div className="card overflow-x-auto">
        <table className="min-w-full">
          <thead><tr className="text-left">
            <th className="p-2">Code</th>
            <th className="p-2">Type</th>
            <th className="p-2">Value</th>
            <th className="p-2">Status</th>
            <th className="p-2">Expires</th>
            <th className="p-2">Used/Limit</th>
            <th className="p-2 text-right">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3 text-center" colSpan={7}>Đang tải…</td></tr>
            ) : rows.length ? rows.map(r => (
              <tr key={r._id} className="border-t">
                <td className="p-2 font-medium">{r.code}</td>
                <td className="p-2">{r.type}</td>
                <td className="p-2">{r.value}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2 text-sm text-gray-500">{r.expiresAt ? new Date(r.expiresAt).toLocaleString() : '—'}</td>
                <td className="p-2 text-sm text-gray-500">{r.usedCount ?? 0}/{r.usageLimit ?? '∞'}</td>
                <td className="p-2 text-right space-x-2">
                  <button className="btn-ghost" onClick={() => startEdit(r)}>Sửa</button>
                  <button className="btn-ghost" onClick={() => remove(r._id)}>Xoá</button>
                </td>
              </tr>
            )) : (
              <tr><td className="p-3 text-center text-gray-500" colSpan={7}>Trống</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
