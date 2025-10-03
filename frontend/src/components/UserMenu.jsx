// src/components/UserMenu.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../stores/auth";

export default function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return <Link to="/login">Đăng nhập</Link>;

  return (
    <div className="flex items-center gap-3">
      {/* nút Admin chỉ hiện với admin */}
      {user.role === "admin" && (
        <Link
          to="/admin"
          className="px-3 py-1 rounded border hover:bg-gray-50"
        >
          Admin
        </Link>
      )}
      <Link to="/orders">Đơn hàng</Link>
      <Link to="/profile">Hồ sơ</Link>
      <Link to="/change-password">Đổi mật khẩu</Link>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
