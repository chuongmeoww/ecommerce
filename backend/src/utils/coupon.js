export function computeDiscount(subtotal, coupon) {
  const n = Number(subtotal) || 0;
  if (!coupon) return 0;
  if (coupon.type === 'percent') {
    return Math.floor((n * Number(coupon.value || 0)) / 100);
  }
  return Math.min(n, Math.floor(Number(coupon.value || 0)));
}

export function validateCoupon(coupon, { subtotal = 0 } = {}) {
  if (!coupon) return { ok: false, reason: 'NOT_FOUND' };
  if (coupon.status !== 'active') return { ok: false, reason: 'INACTIVE' };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { ok: false, reason: 'EXPIRED' };
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { ok: false, reason: 'LIMIT_REACHED' };
  if (coupon.minOrder && subtotal < coupon.minOrder) return { ok: false, reason: 'MIN_ORDER' };
  return { ok: true };
}
