// src/App.jsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// ✅ Dùng 1 cặp header/footer toàn site
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';

// pages
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';
import ProtectedRoute from './components/ProtectedRoute';

// admin
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import ProductsList from './pages/admin/ProductsList';
import ProductForm from './pages/admin/ProductForm';
import AdminOrdersList from './pages/admin/AdminOrdersList';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import UsersList from './pages/admin/UsersList';
import UserEdit from './pages/admin/UserEdit';

// ✅ PublicLayout giờ chỉ còn Outlet (không render header/footer nữa)
function PublicLayout() {
  return <Outlet />;
}

function NotFound() {
  return <div className="max-w-7xl mx-auto px-4 py-12">Trang không tồn tại.</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          {/* Header/Footer để ngoài Suspense cho mượt */}
          <SiteHeader />
          <Suspense fallback={<div className="px-4 py-8">Đang tải…</div>}>
            <Routes>
              {/* Public */}
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="collection" element={<Collection />} />
                <Route path="product/:slug" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-success" element={<OrderSuccess />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot" element={<Forgot />} />
                <Route path="reset" element={<Reset />} />

                {/* Require login */}
                <Route element={<ProtectedRoute />}>
                  <Route path="orders" element={<Orders />} />
                </Route>
              </Route>

              {/* Admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<ProductsList />} />
                  <Route path="products" element={<ProductsList />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id" element={<ProductForm />} />
                  <Route path="orders" element={<AdminOrdersList />} />
                  <Route path="orders/:id" element={<AdminOrderDetail />} />
                  <Route path="users" element={<UsersList />} />
                  <Route path="users/:id" element={<UserEdit />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <SiteFooter />
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
