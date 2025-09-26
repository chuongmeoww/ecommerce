import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const nav = [
    { to:"/collection?collection=ao", label:"Áo" },
    { to:"/collection?collection=quan", label:"Quần" },
    { to:"/collection?collection=phu-kien-thoi-trang", label:"Phụ kiện" },
    { to:"/collection?collection=khuyen-mai", label:"Khuyến mãi" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded-lg border" onClick={()=>setOpen(v=>!v)} aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor"/></svg>
          </button>
          <Link to="/" className="font-bold text-lg">Ecommerce</Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map(n=>(
            <NavLink key={n.to} to={n.to} className={({isActive})=>`text-sm ${isActive?'text-brand-700 font-semibold':'text-gray-700 hover:text-black'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="btn-ghost">Giỏ hàng</Link>
          {user ? (
            <div className="relative">
              <details className="dropdown dropdown-end">
                <summary className="btn-ghost cursor-pointer">Xin chào, {user.name || 'User'}</summary>
                <ul className="menu dropdown-content bg-white rounded-xl shadow-soft border p-2 mt-2 w-48">
                  <li><Link to="/orders">Đơn hàng</Link></li>
                  <li><Link to="/profile">Hồ sơ</Link></li>
                  {user.role === 'admin' && <li><Link to="/admin">Quản trị</Link></li>}
                  <li><button onClick={logout}>Đăng xuất</button></li>
                </ul>
              </details>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Đăng nhập</Link>
              <Link to="/register" className="btn-primary">Đăng ký</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-2 flex flex-col">
            {nav.map(n=>(
              <Link key={n.to} to={n.to} className="px-2 py-3 border-b last:border-b-0" onClick={()=>setOpen(false)}>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
