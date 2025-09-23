// src/services/orders.js
import api from './api';

/** Tạo đơn hàng */
export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload);   // BE trả { order }
  return data.order;
}

/** Danh sách đơn của tôi (có phân trang) */
export async function fetchMyOrders(params = {}) {
  const { data } = await api.get('/orders/my', { params }); // { items, pagination }
  return data;
}

/** Xem chi tiết 1 đơn (của tôi) theo id */
export async function getMyOrder(id) {
  const { data } = await api.get(`/orders/${id}`); // { order }
  return data.order;
}

/** Huỷ 1 đơn (của tôi) theo id */
export async function cancelMyOrder(id) {
  const { data } = await api.patch(`/orders/${id}/cancel`); // { order }
  return data.order;
}

/* ---------- Aliases để không phải đổi ở các component cũ ---------- */
// OrderSuccess.jsx đang gọi fetchOrderById
export async function fetchOrderById(id) {
  return getMyOrder(id);
}
// Orders.jsx đang gọi cancelOrder
export async function cancelOrder(id) {
  return cancelMyOrder(id);
}
