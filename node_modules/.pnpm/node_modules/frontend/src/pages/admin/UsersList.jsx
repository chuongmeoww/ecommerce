import { useEffect, useState } from 'react';
import api, { extractError } from '../../services/api';
import { Link } from 'react-router-dom';

export default function UsersList() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [err, setErr] = useState(null);

  const fetchData = async (page = 1) => {
    try {
      const { data } = await api.get('/admin/users', { params: { q, role, status, page, limit: 12 } });
      setData(data);
    } catch (e) { setErr(extractError(e)); }
  };

  useEffect(() => { fetchData(1); /* eslint-disable-next-line */ }, []);

  const remove = async (id) => {
    if (!confirm('Xoá người dùng này?')) return;
    try { await api.delete(`/admin/users/${id}`); fetchData(data.page); }
    catch (e) { alert(extractError(e).message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold">Người dùng</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-2 mb-4">
        <input className="input" placeholder="Tìm theo tên / email..." value={q} onChange={e=>setQ(e.target.value)} />
        <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">Tất cả vai trò</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">active</option>
          <option value="blocked">blocked</option>
        </select>
        <button className="btn-ghost" onClick={()=>fetchData(1)}>Lọc</button>
      </div>

      {err && <div className="error-text mb-3">{err.message}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">Tên</th>
              <th className="py-2">Email</th>
              <th className="py-2">Vai trò</th>
              <th className="py-2">Trạng thái</th>
              <th className="py-2">Tạo lúc</th>
              <th className="py-2 w-40"></th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(u => (
              <tr key={u._id} className="border-t">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.role}</td>
                <td className="py-2">{u.status}</td>
                <td className="py-2">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="py-2 flex gap-2">
                  <Link to={`/admin/users/${u._id}`} className="btn-ghost">Sửa</Link>
                  <button className="btn-ghost" onClick={()=>remove(u._id)}>Xoá</button>
                </td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr><td colSpan="6" className="py-6 text-center text-gray-500">Không có người dùng</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {data.pages > 1 && (
        <div className="mt-4 flex gap-2">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={()=>fetchData(n)} className={`btn-ghost ${data.page===n?'bg-gray-100':''}`}>{n}</button>
          ))}
        </div>
      )}
    </div>
  );
}
