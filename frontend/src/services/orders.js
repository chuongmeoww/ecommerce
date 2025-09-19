// import api from './api';

// // Tạo đơn hàng
// export async function createOrder(payload) {
//   // payload: { items, shippingAddress, note, couponCode? }
//   const { data } = await api.post('/orders', payload);
//   return data.order;
// }

// // Lịch sử đơn của tôi
// export async function fetchMyOrders(params = {}) {
//   const { data } = await api.get('/orders/my', { params });
//   return data;
// }

// // Chi tiết đơn
// export async function fetchOrderById(id) {
//   const { data } = await api.get(`/orders/${id}`);
//   return data.order;
// }

// // Hủy đơn
// export async function cancelOrder(id) {
//   const { data } = await api.patch(`/orders/${id}/cancel`);
//   return data.order;
// }
import api from './api';

/**
 * @typedef {Object} OrderItem
 * @property {string} productId - _id sản phẩm (bắt buộc)
 * @property {string} name
 * @property {string} slug
 * @property {string} image
 * @property {number} price
 * @property {number} qty
 * @property {string=} size
 * @property {string=} color
 * @property {string=} sku
 */

/**
 * Tạo đơn hàng
 * @param {{items: OrderItem[], shippingAddress: any, note?: string, couponCode?: string}} payload
 * @returns {Promise<any>} order
 */
export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data.order;
}

/**
 * Lịch sử đơn của tôi
 * @param {{page?: number, limit?: number}} params
 */
export async function fetchMyOrders(params = {}) {
  const { data } = await api.get('/orders/my', { params });
  return data;
}

/** Chi tiết đơn (chỉ chủ đơn xem được) */
export async function fetchOrderById(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data.order;
}

/** Hủy đơn (khi pending/confirmed) */
export async function cancelOrder(id) {
  const { data } = await api.patch(`/orders/${id}/cancel`);
  return data.order;
}
