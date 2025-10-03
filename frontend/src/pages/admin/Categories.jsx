// src/pages/admin/Categories.jsx
import { useEffect, useState } from 'react';
import api, { extractError } from '../../services/api';

export default function Categories() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [editingId, setEditingId] = useState(null);

  const slugify = (s='') =>
    s.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const load = async () => {
    setLoading(true); setErr(null);
    try {
      const { data } = await api.get('/admin/categories');
      setRows(data.items ?? data.categories ?? []);
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
    setForm({ name: row.name || '', slug: row.slug || '' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', slug: '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: form.name.trim(), slug: form.slug.trim() || slugify(form.name) };
      if (!payload.name) return;
      if (editingId) {
        await api.patch(`/admin/categories/${editingId}`, payload);
      } else {
        await api.post('/admin/categories', payload);
      }
      resetForm();
      await load();
    } catch (e2) { alert(extractError(e2).message); }
  };

  const remove = async (id) => {
    if (!confirm('Xoá category này?')) return;
    try { await api.delete(`/admin/categories/${id}`); await load(); }
    catch (e) { alert(extractError(e).message); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>

      <form onSubmit={submit} className="card grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input className="input" name="name" placeholder="Name"
               value={form.name} onChange={onChange}
               onBlur={() => !form.slug && setForm(v=>({ ...v, slug: slugify(v.name) }))} />
        <input className="input" name="slug" placeholder="Slug"
               value={form.slug} onChange={onChange} />
        <div className="flex gap-2">
          <button className="btn-primary" type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
          {editingId && <button type="button" className="btn-ghost" onClick={resetForm}>Huỷ</button>}
        </div>
      </form>

      {err && <div className="error-text">{err.message}</div>}

      <div className="card overflow-x-auto">
        <table className="min-w-full">
          <thead><tr className="text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Slug</th>
            <th className="p-2 text-right">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3 text-center" colSpan={3}>Đang tải…</td></tr>
            ) : rows.length ? rows.map(r => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{r.name}</td>
                <td className="p-2 text-gray-500">{r.slug}</td>
                <td className="p-2 text-right space-x-2">
                  <button className="btn-ghost" onClick={() => startEdit(r)}>Sửa</button>
                  <button className="btn-ghost" onClick={() => remove(r._id)}>Xoá</button>
                </td>
              </tr>
            )) : (
              <tr><td className="p-3 text-center text-gray-500" colSpan={3}>Trống</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
