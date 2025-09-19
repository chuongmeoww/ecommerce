import { useEffect, useState } from 'react';
import api, { extractError } from '../../services/api';
import { Link } from 'react-router-dom';

export default function ProductsList() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [q, setQ] = useState('');
  const [err, setErr] = useState(null);

  const fetchData = async (page = 1) => {
    try {
      const res = await api.get('/admin/products', { params: { q, page, limit: 12 } });
      setData(res.data);
    } catch (e) { setErr(extractError(e)); }
  };

  useEffect(() => { fetchData(); }, []);

  const remove = async (id) => {
    if (!confirm('Xoá sản phẩm này?')) return;
    try { await api.delete(`/admin/products/${id}`); fetchData(data.page); }
    catch (e) { alert(extractError(e).message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold">Sản phẩm</h1>
        <Link to="/admin/products/new" className="btn-primary">Thêm sản phẩm</Link>
      </div>

      <div className="flex gap-2 mb-4">
        <input className="input flex-1" placeholder="Tìm theo tên/miêu tả..." value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn-ghost" onClick={()=>fetchData(1)}>Tìm</button>
      </div>

      {err && <div className="error-text mb-3">{err.message}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {data.items.map(p => (
          <div key={p._id} className="card">
            <img src={p.images?.[0]?.url || `https://picsum.photos/seed/${p._id}/600/750`} alt="" className="rounded-xl mb-2 aspect-[4/5] object-cover w-full" />
            <div className="text-sm font-medium line-clamp-2">{p.name}</div>
            <div className="mt-1 text-sm">
              {(p.salePrice ?? p.price).toLocaleString()} VND
              {p.salePrice && <span className="text-gray-400 line-through ml-1">{p.price.toLocaleString()}</span>}
            </div>
            <div className="mt-2 flex gap-2">
              <Link to={`/admin/products/${p._id}`} className="btn-ghost">Sửa</Link>
              <button className="btn-ghost" onClick={()=>remove(p._id)}>Xoá</button>
            </div>
          </div>
        ))}
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
// export default function ProductsList() {
//   return <div className="card">Danh sách sản phẩm (admin)</div>;
// }
