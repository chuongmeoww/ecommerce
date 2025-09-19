// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import HeaderYame from './components/HeaderYame';

// Public pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';
import ProductDetail from './pages/ProductDetail';
import Collection from './pages/Collection';
import Cart from './pages/Cart';

// ⚡ Lazy load 3 trang dễ gây crash nếu thiếu service
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));

// User/Admin
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import ProductsList from './pages/admin/ProductsList';
import ProductForm from './pages/admin/ProductForm';
import UsersList from './pages/admin/UsersList';
import UserEdit from './pages/admin/UserEdit';

function NotFound() { /* giữ nguyên như bạn */ return (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-semibold mb-2">404</h1>
    <p>Trang bạn tìm không tồn tại.</p>
  </div>
);}
function Ping(){ return <div className="max-w-7xl mx-auto px-4 py-8">Router OK</div>;}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <HeaderYame />
          <Suspense fallback={<div className="px-4 py-8">Đang tải…</div>}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/cart" element={<Cart />} />

              {/* 3 trang lazy */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Require login */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/change" element={<ChangePassword />} />
                <Route path="/orders" element={<Orders />} />
              </Route>

              {/* Admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="products" replace />} />
                  <Route path="products" element={<ProductsList />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id" element={<ProductForm />} />
                  <Route path="users" element={<UsersList />} />
                  <Route path="users/:id" element={<UserEdit />} />
                </Route>
              </Route>

              {/* Sanity + 404 */}
              <Route path="/_ping" element={<Ping />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
