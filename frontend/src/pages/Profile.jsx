// src/pages/Profile.jsx
import { useEffect, useMemo, useState } from 'react';
import api, { extractError } from '../services/api';

const GENDERS = [
  { value: '', label: '-- Chọn --' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

function toDateInputValue(d) {
  if (!d) return '';
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return '';
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export default function Profile() {
  const [init, setInit] = useState(null); // dữ liệu ban đầu để so sánh diff
  const [form, setForm] = useState({
    name: '',
    avatarUrl: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Load profile
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        const u = data?.user || {};
        const next = {
          name: u.name || '',
          avatarUrl: u.avatarUrl || '',
          phone: u.phone || '',
          address: u.address || '',
          dob: toDateInputValue(u.dob),
          gender: u.gender || '',
          email: u.email || '',
        };
        if (!mounted) return;
        setForm(next);
        setInit(next);
      } catch (e) {
        const er = extractError(e);
        setMsg({ type: 'error', text: er.message || 'Không tải được hồ sơ' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const changed = useMemo(() => {
    if (!init) return false;
    return (
      init.name !== form.name ||
      init.avatarUrl !== form.avatarUrl ||
      init.phone !== form.phone ||
      init.address !== form.address ||
      init.dob !== form.dob ||
      init.gender !== form.gender
    );
  }, [init, form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!changed) {
      setMsg({ type: 'info', text: 'Không có thay đổi để lưu.' });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      // chỉ gửi các field thay đổi
      const payload = {};
      for (const k of ['name', 'avatarUrl', 'phone', 'address', 'dob', 'gender']) {
        if (form[k] !== init[k]) {
          if (k === 'dob') {
            // chỉ gửi nếu có giá trị
            if (form.dob) payload.dob = form.dob;
          } else {
            payload[k] = form[k];
          }
        }
      }
      const { data } = await api.patch('/users/me', payload);
      const u = data?.user || {};
      const next = {
        name: u.name || '',
        avatarUrl: u.avatarUrl || '',
        phone: u.phone || '',
        address: u.address || '',
        dob: toDateInputValue(u.dob),
        gender: u.gender || '',
        email: u.email || '',
      };
      setForm(next);
      setInit(next);
      setMsg({ type: 'success', text: 'Cập nhật thành công.' });
    } catch (err) {
      const er = extractError(err);
      setMsg({ type: 'error', text: er.message || 'Cập nhật thất bại.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-24 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-1">Thông tin cá nhân</h1>
      {form.email && <p className="text-gray-500 mb-4">{form.email}</p>}

      {msg && (
        <div
          className={`mb-4 p-3 rounded border ${
            msg.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : msg.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Họ tên */}
        <div>
          <label className="block text-sm font-medium">Họ tên</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Ví dụ: Nguyễn Văn A"
          />
        </div>

        {/* Ảnh đại diện */}
        <div>
          <label className="block text-sm font-medium">Ảnh đại diện (URL)</label>
          <input
            name="avatarUrl"
            value={form.avatarUrl}
            onChange={onChange}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="https://…"
          />
          {form.avatarUrl ? (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={form.avatarUrl}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22128%22 height=%22128%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23eee%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-family=%22Arial%22 font-size=%2220%22>No Image</text></svg>';
                }}
              />
              <span className="text-sm text-gray-500">Xem trước</span>
            </div>
          ) : null}
        </div>

        {/* Phone + DOB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Số điện thoại</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="09xxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Ngày sinh</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={onChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Địa chỉ</label>
          <input
            name="address"
            value={form.address}
            onChange={onChange}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Số nhà, đường, phường, quận, thành phố"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium">Giới tính</label>
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            {GENDERS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !changed}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            title={!changed ? 'Không có thay đổi' : ''}
          >
            {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
          {!changed && <span className="text-sm text-gray-500">Không có thay đổi</span>}
        </div>
      </form>
    </div>
  );
}
