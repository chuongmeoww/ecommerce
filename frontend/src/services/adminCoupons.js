import api, { extractError } from "./api";

export async function listAdminCoupons(params = {}) {
  const { data } = await api.get("/admin/coupons", { params });
  return data;
}
export async function createAdminCoupon(payload) {
  try {
    const { data } = await api.post("/admin/coupons", payload);
    return data.coupon || data;
  } catch (e) { throw extractError(e); }
}
export async function updateAdminCoupon(id, payload) {
  try {
    const { data } = await api.patch(`/admin/coupons/${id}`, payload);
    return data.coupon || data;
  } catch (e) { throw extractError(e); }
}
export async function deleteAdminCoupon(id) {
  try {
    const { data } = await api.delete(`/admin/coupons/${id}`);
    return data;
  } catch (e) { throw extractError(e); }
}
