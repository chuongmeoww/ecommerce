// // frontend/src/services/category.js
// import api from './api';

// export async function fetchCategories() {
//   const { data } = await api.get('/categories');
//   return data.categories || [];
// }
// src/services/category.js
import api from './api';

export async function fetchCategories() {
  const { data } = await api.get('/categories');
  return data.categories || [];
}
