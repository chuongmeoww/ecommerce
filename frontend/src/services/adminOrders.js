// frontend/src/services/adminOrders.js
import api from './api';

export async function adminFetchOrders(params = {}) {
  const { data } = await api.get('/admin/orders', { params });
  return data;
}

export async function adminFetchOrder(id) {
  const { data } = await api.get(`/admin/orders/${id}`);
  return data.order;
}

export async function adminUpdateOrder(id, payload) {
  const { data } = await api.patch(`/admin/orders/${id}`, payload);
  return data.order;
}

export async function adminCancelOrder(id) {
  const { data } = await api.post(`/admin/orders/${id}/cancel`);
  return data.order;
}
