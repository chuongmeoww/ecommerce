import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64 border-r bg-white z-40 hidden md:block">
        <AdminSidebar />
      </div>

      <div className="md:ml-64">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
          <AdminTopbar />
        </div>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
