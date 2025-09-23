import api from './api';

export async function fetchReviews(idOrSlug, params = {}) {
  const { data } = await api.get(`/products/${idOrSlug}/reviews`, { params });
  return data;
}

export async function createReview(idOrSlug, payload) {
  const { data } = await api.post(`/products/${idOrSlug}/reviews`, payload);
  return data.review;
}
