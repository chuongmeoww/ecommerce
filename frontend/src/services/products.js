import api from './api';

export async function listProducts(params = {}) {
  const { data } = await api.get('/products', { params });
  return data; // { items, pagination, facets }
}