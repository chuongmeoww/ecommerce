import api from "./api";

/**
 * params: { q, collection, category, priceMin, priceMax, sort, page, limit }
 * BE của bạn đã nhận các query tương tự /products
 */
export async function listProducts(params = {}) {
  const { data } = await api.get("/products", { params });
  return data; // { items, pagination }
}
