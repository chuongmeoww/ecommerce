import { Link, NavLink, useNavigate } from "react-router-dom";
import Container from "./Container";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  function handleLogout() {
    logout();
    setOpen(false);
    nav("/", { replace: true });
  }

  const linkBase =
    "px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition";
  const linkActive = "bg-gray-100 font-medium";

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <Container className="h-14 flex items-center justify-between">
        {/* Left: Logo + main nav */}
        <div className="flex items-center gap-3">
          <Link to="/" className="font-bold text-lg tracking-tight">
            MERN Mart
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
              end
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Sản phẩm
            </NavLink>
            <NavLink
              to="/collection?collection=khuyen-mai"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Khuyến mãi
            </NavLink>
          </nav>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
            aria-label="Giỏ hàng"
          >
            🛒 Giỏ hàng
          </Link>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link className="btn-ghost text-sm" to="/login">Đăng nhập</Link>
              <Link className="btn-primary text-sm" to="/register">Đăng ký</Link>
            </div>
          ) : (
            <details
              className="relative select-none"
              open={open}
              onToggle={(e) => setOpen(e.currentTarget.open)}
            >
              <summary className="list-none cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 text-sm flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                  {String(user.name || user.email || "U").slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:block">{user.name || user.email}</span>
                <span className="ml-1 text-gray-500">▾</span>
              </summary>
              <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-soft p-1">
                <Link
                  to="/orders"
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Đơn hàng của tôi
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Hồ sơ
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Trang quản trị
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-red-600"
                >
                  Đăng xuất
                </button>
              </div>
            </details>
          )}
        </div>
      </Container>
    </header>
  );
}
