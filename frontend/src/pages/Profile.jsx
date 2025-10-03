import { useEffect, useState } from "react";
import Container from "../components/layout/Container";
import api, { extractError } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(null);
        const { data } = await api.get("/users/me");
        if (!alive) return;
        setValues({
          name: data?.user?.name || "",
          email: data?.user?.email || "",
          phone: data?.user?.phone || "",
          address: data?.user?.address || "",
        });
      } catch (e) {
        setErr(extractError(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, []);

  const onChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setOk("");
    try {
      setSaving(true);
      await api.patch("/users/me", {
        name: values.name || undefined,
        phone: values.phone || undefined,
        address: values.address || undefined,
      });
      setOk("Đã lưu thay đổi.");
    } catch (e) {
      setErr(extractError(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Container className="py-8">Đang tải…</Container>;

  return (
    <Container className="py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Hồ sơ của tôi</h1>

        <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-4 md:p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Họ và tên">
              <input
                name="name"
                className="input"
                value={values.name}
                onChange={onChange}
                placeholder="Nguyễn Văn A"
              />
            </Field>
            <Field label="Email">
              <input className="input bg-gray-50" value={values.email} disabled />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Số điện thoại">
              <input
                name="phone"
                className="input"
                value={values.phone}
                onChange={onChange}
                placeholder="09xxxxxxxx"
              />
            </Field>
            <Field label="Địa chỉ">
              <input
                name="address"
                className="input"
                value={values.address}
                onChange={onChange}
                placeholder="Số nhà, đường, phường…"
              />
            </Field>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link to="/change-password" className="text-sm text-blue-600 hover:underline">
              Đổi mật khẩu
            </Link>
            <button className="btn-primary" disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu thay đổi"}
            </button>
          </div>

          {err && <div className="text-sm text-red-600">{err.message}</div>}
          {ok && <div className="text-sm text-green-600">{ok}</div>}
        </form>

        <div className="mt-6 rounded-2xl border bg-white p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Đơn hàng gần đây</div>
              <div className="text-sm text-gray-600">Xem lịch sử mua hàng của bạn</div>
            </div>
            <Link to="/orders" className="btn-ghost">Xem đơn</Link>
          </div>
        </div>
      </div>
    </Container>
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
