import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../stores/auth"; // hook/state đăng nhập của bạn

export default function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
