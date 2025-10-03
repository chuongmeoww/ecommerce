// src/utils/img.js

// Trả về URL ảnh từ nhiều dạng dữ liệu khác nhau
// export function imgOf(input) {
//   if (!input) return "";
//   if (typeof input === "string") return input;
//   if (Array.isArray(input)) return imgOf(input[0]);
//   if (typeof input === "object" && input.url) return input.url;
//   return "";
// }

// // Lấy ảnh đầu tiên của product (tiện dùng chỗ khác)
// export function firstImage(product) {
//   return imgOf(product?.images?.[0] || product?.image || "");
// }
export const imgOf = (im) => (typeof im === "string" ? im : im?.url) || "";
