import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Container from './Container';
import { useState } from 'react';

export default function PublicHeader() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-[var(--border)]">
      <Container className="h-16 flex items-center gap-4">
        <Link to="/" className="font-bold text-lg tracking-wide">Ecommerce</Link>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <NavLink to="/collection" className={({isActive})=>isActive?'text-[var(--brand)] font-medium':'text-slate-600 hover:text-slate-900'}>Tất cả</NavLink>
          <NavLink to="/collection?collection=ao" className="text-slate-600 hover:text-slate-900">Áo</NavLink>
          <NavLink to="/collection?collection=quan" className="text-slate-600 hover:text-slate-900">Quần</NavLink>
          <NavLink to="/collection?collection=phu-kien-thoi-trang" className="text-slate-600 hover:text-slate-900">Phụ kiện</NavLink>
          <NavLink to="/collection?collection=khuyen-mai" className="text-slate-600 hover:text-slate-900">Khuyến mãi</NavLink>
        </nav>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Link to="/cart" className="btn-ghost">Giỏ hàng</Link>
          {user ? (
            <>
              <Link to="/orders" className="btn-ghost">Đơn hàng</Link>
              <button onClick={logout} className="btn-ghost">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Đăng nhập</Link>
              <Link to="/register" className="btn-primary">Đăng ký</Link>
            </>
          )}
          <button className="md:hidden btn-ghost" onClick={()=>setOpen(v=>!v)}>☰</button>
        </div>
      </Container>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-white">
          <Container className="py-3 flex flex-col gap-2 text-sm">
            <Link to="/collection" onClick={()=>setOpen(false)}>Tất cả</Link>
            <Link to="/collection?collection=ao" onClick={()=>setOpen(false)}>Áo</Link>
            <Link to="/collection?collection=quan" onClick={()=>setOpen(false)}>Quần</Link>
            <Link to="/collection?collection=phu-kien-thoi-trang" onClick={()=>setOpen(false)}>Phụ kiện</Link>
            <Link to="/collection?collection=khuyen-mai" onClick={()=>setOpen(false)}>Khuyến mãi</Link>
          </Container>
        </div>
      )}
    </header>
  );
}