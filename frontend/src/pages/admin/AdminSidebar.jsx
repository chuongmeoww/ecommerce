import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkCls = ({ isActive }) =>
  'admin-navlink' + (isActive ? ' active' : '');

export default function AdminSidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="admin-nav">
      <NavLink to="/admin" end className={linkCls}>Dashboard</NavLink>

      <div className="admin-nav-group">Catalog</div>
      <NavLink to="/admin/products" className={linkCls}>Products</NavLink>
      <NavLink to="/admin/orders" className={linkCls}>Orders</NavLink>
      <NavLink to="/admin/users" className={linkCls}>Users</NavLink>
      <NavLink to="/admin/coupons" className={linkCls}>Coupons</NavLink>

      {isAdmin && (
        <>
          <div className="admin-nav-group">Settings</div>
          <NavLink to="/admin/meta" className={linkCls}>Site Meta</NavLink>
        </>
      )}
    </nav>
  );
}