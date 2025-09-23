import api from './api';

export async function applyCoupon(code, subtotal, extra = {}) {
  const { data } = await api.post('/coupons/apply', { code, subtotal, ...extra });
  return data; // { valid, discount, coupon }
}
