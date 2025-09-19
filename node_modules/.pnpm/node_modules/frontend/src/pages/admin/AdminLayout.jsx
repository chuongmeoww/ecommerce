// import { Link, Outlet, useLocation } from 'react-router-dom';

// export default function AdminLayout() {
//   const { pathname } = useLocation();
//   const Item = ({ to, children }) => (
//     <Link to={to} className={`block px-3 py-2 rounded-lg ${pathname.startsWith(to) ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>{children}</Link>
//   );
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[16rem_1fr] gap-6">
//       <aside className="card h-max sticky top-24">
//         <div className="font-semibold mb-3">Admin</div>
//         <nav className="space-y-2 text-sm">
//           <Item to="/admin/products">Sản phẩm</Item>
//           <Item to="/admin/products/new">Thêm sản phẩm</Item>
//         </nav>
//       </aside>
//       <main><Outlet /></main>
//     </div>
//   );
// }
import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[16rem_1fr] gap-6">
      <aside className="card h-max sticky top-24">
        <div className="font-semibold mb-3">Admin</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/products" className="btn-ghost block text-center">Sản phẩm</Link>
          <Link to="/admin/products/new" className="btn-ghost block text-center">Thêm sản phẩm</Link>
          <Link to="/admin/users" className="btn-ghost block text-center">Người dùng</Link>
        </nav>
      </aside>
      <main><Outlet /></main>
    </div>
  );
}
