import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { extractError } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, categories: 0, coupons: 0 });
  const [err, setErr] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const [p, o, u, c, cc] = await Promise.all([
          api.get("/admin/products", { params: { page: 1, limit: 1 } }),
          api.get("/admin/orders",   { params: { page: 1, limit: 1 } }),
          api.get("/admin/users",    { params: { page: 1, limit: 1 } }),
          api.get("/admin/categories"),
          api.get("/admin/coupons"),
        ]);
        if (ignore) return;
        const pickTotal = (res) => res.data?.total ?? res.data?.items?.length ?? res.data?.length ?? 0;
        setStats({
          products: pickTotal(p),
          orders: pickTotal(o),
          users: pickTotal(u),
          categories: pickTotal(c),
          coupons: pickTotal(cc),
        });
      } catch (e) { if (!ignore) setErr(extractError(e)); }
    })();
    return () => { ignore = true; };
  }, []);

  const Card = ({ to, title, value, desc }) => (
    <Link to={to} className="block rounded-2xl border p-5 hover:shadow-md transition">
      <div className="text-sm text-gray-500">{desc}</div>
      <div className="mt-1 text-xl font-semibold">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </Link>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      {err && <div className="text-red-600">{err.message}</div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card to="/admin/products"   title="Products"   value={stats.products}   desc="Tổng số sản phẩm" />
        <Card to="/admin/orders"     title="Orders"     value={stats.orders}     desc="Tổng số đơn" />
        <Card to="/admin/users"      title="Users"      value={stats.users}      desc="Người dùng" />
        <Card to="/admin/categories" title="Categories" value={stats.categories} desc="Danh mục" />
        <Card to="/admin/coupons"    title="Coupons"    value={stats.coupons}    desc="Mã giảm giá" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <div className="mb-2 font-semibold">Tác vụ nhanh</div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/products/new" className="px-3 py-2 rounded border">Thêm sản phẩm</Link>
            <Link to="/admin/categories" className="px-3 py-2 rounded border">Quản lý categories</Link>
            <Link to="/admin/coupons" className="px-3 py-2 rounded border">Quản lý coupons</Link>
          </div>
        </div>
        <div className="rounded-2xl border p-5">
          <div className="mb-2 font-semibold">Hướng dẫn</div>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Tạo sản phẩm mới và gán vào danh mục</li>
            <li>Tạo coupon cho chiến dịch</li>
            <li>Theo dõi đơn hàng gần đây</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
