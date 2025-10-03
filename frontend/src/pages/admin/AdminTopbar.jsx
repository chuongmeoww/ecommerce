import { Link, useLocation } from "react-router-dom";

export default function AdminTopbar() {
  const { pathname } = useLocation();
  const title = getTitle(pathname);

  return (
    <div className="h-14 px-3 md:px-5 flex items-center justify-between">
      <div className="font-semibold">{title}</div>
      <div className="flex items-center gap-2">
        {pathname.startsWith("/admin/products") && (
          <Link to="/admin/products/new" className="btn-primary text-sm">+ Thêm sản phẩm</Link>
        )}
      </div>
    </div>
  );
}

function getTitle(path) {
  if (path === "/admin") return "Tổng quan";
  if (path.startsWith("/admin/products")) return "Quản lý sản phẩm";
  if (path.startsWith("/admin/orders")) return "Quản lý đơn hàng";
  if (path.startsWith("/admin/users")) return "Quản lý người dùng";
  if (path.startsWith("/admin/coupons")) return "Mã giảm giá";
  return "Quản trị";
}
