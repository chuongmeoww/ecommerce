import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminTopbar({ onToggleSide }) {
  const { user, logout } = useAuth();

  return (
    <header className="admin-topbar">
      <button className="btn-ghost" onClick={onToggleSide} aria-label="Toggle sidebar">☰</button>
      <div className="flex-1" />
      <div className="admin-topbar-right">
        <Link to="/" className="btn-ghost">View site</Link>
        <div className="admin-user">
          <div className="avatar">{String(user?.name || 'U').slice(0,1).toUpperCase()}</div>
          <div className="info">
            <div className="name">{user?.name || 'User'}</div>
            <div className="role">{user?.role || 'customer'}</div>
          </div>
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
}