export const fmt = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "₫";
export const discountPct = (base, sale) => {
  if (!base || !sale || sale >= base) return null;
  const pct = Math.round(((base - sale) / base) * 100);
  return pct > 0 ? pct : null;
};
