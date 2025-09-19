// src/components/HeaderYame.jsx
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function TopBar() {
  return (
    <div className="bg-black text-white text-xs py-2 text-center">
      Giá Mềm · Mặc Bền · Mặc Sướng — Free ship đơn bất kỳ*
    </div>
  );
}

function MenuItem({ label, children }) {
  return (
    <div className="relative group">
      <button className="px-3 py-2 rounded hover:bg-gray-100">{label}</button>
      {/* Mega dropdown */}
      <div className="absolute left-0 top-full translate-y-1 hidden group-hover:block">
        <div className="w-[960px] bg-white border rounded-xl shadow-lg p-4 grid grid-cols-4 gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function Col({ title, items }) {
  return (
    <div>
      <div className="font-semibold mb-2">{title}</div>
      <ul className="space-y-1 text-sm">
        {items.map((it) => (
          <li key={it.slug}>
            <NavLink
              to={`/collection?category=${it.slug}`}
              className="block px-2 py-1 rounded hover:bg-gray-100"
            >
              {it.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

const CLOTHES = [
  {
    title: 'Áo Thun',
    items: [
      { label: 'Áo thun cổ tròn', slug: 'ao-thun-co-tron' },
      { label: 'Áo thun polo', slug: 'ao-thun-polo' },
      { label: 'Áo thun tay dài', slug: 'ao-thun-tay-dai' },
      { label: 'Áo ba lỗ', slug: 'ao-thun-3-lo' },
    ],
  },
  {
    title: 'Áo Khoác',
    items: [
      { label: 'Parka', slug: 'ao-khoac-parka' },
      { label: 'Kaki', slug: 'ao-khoac-kaki' },
      { label: 'Jeans', slug: 'ao-khoac-jeans' },
      { label: 'Dù', slug: 'ao-khoac-du' },
      { label: 'Bomber', slug: 'ao-khoac-bomber' },
      { label: 'Hoodie', slug: 'ao-khoac-hoodie' },
    ],
  },
  { title: 'Áo Sơ Mi', items: [{ label: 'Áo sơ mi', slug: 'ao-so-mi' }] },
  {
    title: 'Quần Dài',
    items: [
      { label: 'Jeans Slim Fit', slug: 'quan-jeans-slim' },
      { label: 'Jeans lưng thun', slug: 'quan-jeans-lung-thun' },
      { label: 'Jeans Straight', slug: 'quan-jeans-straight' },
      { label: 'Quần tây', slug: 'quan-tay' },
      { label: 'Jogger', slug: 'quan-jogger' },
      { label: 'Kaki', slug: 'quan-kaki' },
    ],
  },
  {
    title: 'Quần Short',
    items: [
      { label: 'Short thun', slug: 'quan-short-thun' },
      { label: 'Short dù', slug: 'quan-short-du' },
      { label: 'Short kaki', slug: 'quan-short-kaki' },
      { label: 'Short jeans', slug: 'quan-short-jeans' },
      { label: 'Short thể thao', slug: 'quan-short-the-thao' },
    ],
  },
];

const ACCESS = [
  {
    title: 'Balo',
    items: [
      { label: 'Doanh nhân', slug: 'balo-doanh-nhan' },
      { label: 'Du lịch', slug: 'balo-du-lich' },
    ],
  },
  {
    title: 'Túi Đeo',
    items: [
      { label: 'Đeo chéo', slug: 'tui-deo-cheo' },
      { label: 'Tote', slug: 'tui-tote' },
      { label: 'Messenger', slug: 'tui-messenger' },
      { label: 'Duffle', slug: 'tui-duffle' },
    ],
  },
  {
    title: 'Nón / Ví',
    items: [
      { label: 'Nón lưỡi trai', slug: 'non-luoi-trai' },
      { label: 'Bucket', slug: 'non-bucket' },
      { label: 'Ví ngang da thật', slug: 'vi-ngang' },
      { label: 'Ví đứng da thật', slug: 'vi-dung' },
    ],
  },
  {
    title: 'Khác',
    items: [
      { label: 'Dép', slug: 'dep' },
      { label: 'Vớ', slug: 'vo' },
      { label: 'Dây nịt', slug: 'day-nit' },
      { label: 'Quần lót', slug: 'quan-lot' },
    ],
  },
];

export default function HeaderYame() {
  const { user, logout } = useAuth();
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/collection?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <TopBar />
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold tracking-tight">KLTN</Link>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <MenuItem label="Quần Áo">
            {CLOTHES.map((col) => (
              <Col key={col.title} title={col.title} items={col.items} />
            ))}
          </MenuItem>
          <MenuItem label="Phụ Kiện">
            {ACCESS.map((col) => (
              <Col key={col.title} title={col.title} items={col.items} />
            ))}
          </MenuItem>
          <NavLink to="/collection" className="px-3 py-2 rounded hover:bg-gray-100">
            Khám phá
          </NavLink>
        </nav>

        {/* Search + actions */}
        <div className="flex items-center gap-2">
          <form onSubmit={onSearch} className="hidden md:flex">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm sản phẩm…"
              className="border rounded-l-lg px-3 py-2 w-64 focus:outline-none"
            />
            <button className="border border-l-0 rounded-r-lg px-3 py-2 bg-gray-50 hover:bg-gray-100">
              Tìm
            </button>
          </form>
          <Link to="/collection" className="px-3 py-2 rounded hover:bg-gray-100">Sản phẩm</Link>
          <Link to="/cart" className="px-3 py-2 rounded hover:bg-gray-100">Giỏ</Link>

          {!user ? (
            <>
              <Link to="/login" className="px-3 py-2 rounded hover:bg-gray-100">Đăng nhập</Link>
              <Link to="/register" className="px-3 py-2 rounded hover:bg-gray-100">Đăng ký</Link>
            </>
          ) : (
            <>
              {user.role === 'admin' && (
                <Link to="/admin/products" className="px-3 py-2 rounded hover:bg-gray-100">Admin</Link>
              )}
              <Link to="/profile" className="px-3 py-2 rounded hover:bg-gray-100">Tài khoản</Link>
              <button onClick={logout} className="px-3 py-2 rounded hover:bg-gray-100">Đăng xuất</button>
            </>
          )}
        </div>
      </div>

      {/* Mobile bar */}
      <div className="lg:hidden border-t">
        <div className="max-w-screen-2xl mx-auto px-4 py-2 flex items-center gap-2">
          <form onSubmit={onSearch} className="flex-1 flex">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm sản phẩm…"
              className="border rounded-l-lg px-3 py-2 w-full focus:outline-none"
            />
            <button className="border border-l-0 rounded-r-lg px-3 py-2 bg-gray-50 hover:bg-gray-100">
              Tìm
            </button>
          </form>
          <Link to="/collection" className="px-3 py-2 rounded hover:bg-gray-100">SP</Link>
        </div>
      </div>
    </header>
  );
}
