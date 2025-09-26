// frontend/src/services/meta.js
import api from './api';

export async function fetchNav() {
  const { data } = await api.get('/meta/nav');
  // { categories:[{slug,name,count}], collections:[...] }
  return data;
}
