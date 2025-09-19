import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { extractError } from '../../services/api';

export default function UserEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [values, setValues] = useState({ name:'', email:'', role:'user', status:'active' });
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/admin/users/${id}`);
        setValues({ name: data.user.name || '', email: data.user.email || '', role: data.user.role, status: data.user.status });
      } catch (e) { setErr(extractError(e)); }
    })();
  }, [id]);

  const handleChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setErr(null);
    try {
      await api.patch(`/admin/users/${id}`, values);
      nav('/admin/users');
    } catch (e) { setErr(extractError(e)); }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Sửa người dùng</h1>
      {err && <div className="error-text mb-3">{err.message}</div>}

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div><div className="label">Tên</div><input name="name" value={values.name} onChange={handleChange} className="input" /></div>
          <div><div className="label">Email</div><input name="email" value={values.email} onChange={handleChange} className="input" /></div>
        </div>
        <div className="space-y-3">
          <div><div className="label">Vai trò</div>
            <select name="role" value={values.role} onChange={handleChange} className="input">
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div><div className="label">Trạng thái</div>
            <select name="status" value={values.status} onChange={handleChange} className="input">
              <option value="active">active</option>
              <option value="blocked">blocked</option>
            </select>
          </div>
          <div className="pt-2"><button className="btn-primary w-full">Lưu</button></div>
        </div>
      </form>
    </div>
  );
}
