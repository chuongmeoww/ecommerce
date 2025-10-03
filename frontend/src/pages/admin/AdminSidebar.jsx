import { NavLink } from "react-router-dom";

const itemCls =
  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-50";
const active = "bg-gray-100 font-medium";

export default function AdminSidebar() {
  return (
    <aside className="h-full flex flex-col">
      <div className="h-14 flex items-center px-4 border-b">
        <div className="font-bold">MERN Mart Admin</div>
      </div>

      <nav className="p-3 space-y-1">
        <NavLink to="/admin" end className={({isActive})=> `${itemCls} ${isActive?active:""}`}>📊 Dashboard</NavLink>
        <NavLink to="/admin/products" className={({isActive})=> `${itemCls} ${isActive?active:""}`}>🛍️ Sản phẩm</NavLink>
        <NavLink to="/admin/orders" className={({isActive})=> `${itemCls} ${isActive?active:""}`}>📦 Đơn hàng</NavLink>
        <NavLink to="/admin/users" className={({isActive})=> `${itemCls} ${isActive?active:""}`}>👤 Người dùng</NavLink>
        <NavLink to="/admin/coupons" className={({isActive})=> `${itemCls} ${isActive?active:""}`}>🏷️ Mã giảm giá</NavLink>
      </nav>

      <div className="mt-auto p-3 text-xs text-gray-500">
        © {new Date().getFullYear()} MERN Mart
      </div>
    </aside>
  );
}
