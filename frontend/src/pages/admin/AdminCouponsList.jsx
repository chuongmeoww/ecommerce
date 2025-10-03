import { useEffect, useState } from "react";
import { listAdminCoupons, createAdminCoupon, updateAdminCoupon, deleteAdminCoupon } from "../../services/adminCoupons";
import { extractError } from "../../services/api";

const fmtDate = (d) => d ? new Date(d).toLocaleString() : "—";

const empty = { code:"", type:"percent", value:"", maxUses:"", expiresAt:"", active:true, note:"" };

export default function AdminCouponsList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true); setErr(null);
    try {
      const { items } = await listAdminCoupons({ q, limit: 100 });
      setItems(items || []);
    } catch (e) { setErr(extractError(e)); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []); // initial

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true); setErr(null);
    try {
      const payload = {
        code: form.code.trim(),
        type: form.type,
        value: Number(form.value) || 0,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
        active: !!form.active,
        note: form.note || undefined
      };
      if (!payload.code) return alert("Nhập mã coupon");
      await createAdminCoupon(payload);
      setForm(empty);
      await load();
    } catch (e) { setErr(e); }
    finally { setSaving(false); }
  }

  async function toggleActive(it) {
    try {
      const updated = await updateAdminCoupon(it._id, { active: !it.active });
      setItems(list => list.map(x => x._id === it._id ? updated : x));
    } catch (e) { alert(extractError(e).message); }
  }
  async function remove(id) {
    if (!confirm("Xóa coupon này?")) return;
    try {
      await deleteAdminCoupon(id);
      setItems(list => list.filter(x => x._id !== id));
    } catch (e) { alert(extractError(e).message); }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Mã giảm giá</h1>

      <form onSubmit={onCreate} className="rounded-xl border bg-white p-3 grid md:grid-cols-6 gap-3">
        <Field label="Code"><input className="input" value={form.code} onChange={e=>setForm(f=>({...f, code:e.target.value}))} placeholder="SUMMER10" required/></Field>
        <Field label="Loại">
          <select className="input" value={form.type} onChange={e=>setForm(f=>({...f, type:e.target.value}))}>
            <option value="percent">% (theo %) </option>
            <option value="fixed">Giảm cố định</option>
          </select>
        </Field>
        <Field label="Giá trị">
          <input className="input" type="number" value={form.value} onChange={e=>setForm(f=>({...f, value:e.target.value}))} placeholder="10 hoặc 50000" required/>
        </Field>
        <Field label="Max uses">
          <input className="input" type="number" value={form.maxUses} onChange={e=>setForm(f=>({...f, maxUses:e.target.value}))} placeholder="(optional)"/>
        </Field>
        <Field label="Hết hạn">
          <input className="input" type="datetime-local" value={form.expiresAt} onChange={e=>setForm(f=>({...f, expiresAt:e.target.value}))}/>
        </Field>
        <Field label=" "><button className="btn-primary w-full" disabled={saving}>{saving?"Đang lưu…":"Tạo mới"}</button></Field>
        <div className="md:col-span-6"><label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active} onChange={e=>setForm(f=>({...f, active:e.target.checked}))}/>
          Kích hoạt ngay
        </label></div>
        <div className="md:col-span-6">
          <textarea className="input" placeholder="Ghi chú (tuỳ chọn)" value={form.note} onChange={e=>setForm(f=>({...f, note:e.target.value}))}/>
        </div>
      </form>

      <div className="flex items-center gap-2">
        <input className="input w-72" placeholder="Tìm theo code…" value={q} onChange={e=>setQ(e.target.value)}/>
        <button className="btn-ghost" onClick={load}>Tìm</button>
      </div>

      {err && <div className="text-sm text-red-600">{err.message}</div>}

      <div className="rounded-xl border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <Th>Code</Th><Th>Loại</Th><Th>Giá trị</Th><Th>Đã dùng</Th><Th>Giới hạn</Th><Th>Hết hạn</Th><Th>Trạng thái</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3 text-gray-500" colSpan={8}>Đang tải…</td></tr>
            ) : items.length ? items.map(it=>(
              <tr key={it._id} className="border-t">
                <Td className="font-medium">{it.code}</Td>
                <Td>{it.type}</Td>
                <Td>{it.type==='percent' ? `${it.value}%` : `${Number(it.value||0).toLocaleString()}₫`}</Td>
                <Td>{it.used || 0}</Td>
                <Td>{it.maxUses ?? "—"}</Td>
                <Td>{fmtDate(it.expiresAt)}</Td>
                <Td>{it.active ? <span className="text-green-600">Active</span> : <span className="text-gray-500">Inactive</span>}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-sm text-blue-600" onClick={()=>toggleActive(it)}>{it.active?"Tắt":"Bật"}</button>
                    <button className="text-sm text-red-600" onClick={()=>remove(it._id)}>Xóa</button>
                  </div>
                </Td>
              </tr>
            )) : (
              <tr><td className="p-3 text-gray-500" colSpan={8}>Chưa có mã nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      {children}
    </label>
  );
}
function Th({ children }) { return <th className="px-3 py-2 text-left font-medium">{children}</th>; }
function Td({ children, className="" }) { return <td className={`px-3 py-2 ${className}`}>{children}</td>; }
