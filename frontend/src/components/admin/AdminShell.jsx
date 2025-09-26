import { useState } from 'react';
import AdminSidebar from '../../pages/admin/AdminSidebar';
import AdminTopbar from '../../pages/admin/AdminTopbar';

export default function AdminShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-wrap">
      <aside className={`admin-aside ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-brand">
          <span className="logo">YAME</span>
        </div>
        <AdminSidebar onNavigate={() => window.scrollTo({ top: 0 })} />
      </aside>

      <div className="admin-main">
        <AdminTopbar onToggleSide={() => setCollapsed(v => !v)} />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}