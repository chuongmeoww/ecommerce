import { Coupon } from '../models/Coupon.js';
import { computeDiscount, validateCoupon } from '../utils/coupon.js';

/** Public: áp dụng mã (không trừ lượt dùng ở đây) */
export const applyCoupon = async (req, res) => {
  const { code, subtotal = 0 } = req.body || {};
  const c = await Coupon.findOne({ code: String(code || '').trim().toUpperCase() }).lean();
  const check = validateCoupon(c, { subtotal: Number(subtotal) || 0 });
  if (!check.ok) return res.status(400).json({ valid: false, code: check.reason });

  const discount = computeDiscount(subtotal, c);
  return res.json({
    valid: true,
    discount,
    coupon: {
      code: c.code, type: c.type, value: c.value, minOrder: c.minOrder,
      expiresAt: c.expiresAt, usageLimit: c.usageLimit, usedCount: c.usedCount,
    },
  });
};

/** Admin CRUD */
export const adminList = async (req, res) => {
  const { q = '', page = 1, limit = 20 } = req.query;
  const pg = Math.max(1, parseInt(page)); const lim = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;
  const filter = q ? { code: new RegExp(q, 'i') } : {};
  const [items, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim).lean(),
    Coupon.countDocuments(filter),
  ]);
  res.json({ items, pagination: { page: pg, limit: lim, total } });
};

export const adminCreate = async (req, res) => {
  const payload = req.body;
  payload.code = String(payload.code || '').trim().toUpperCase();
  const exists = await Coupon.findOne({ code: payload.code });
  if (exists) return res.status(409).json({ message: 'CODE_TAKEN' });
  const doc = await Coupon.create(payload);
  res.status(201).json({ coupon: doc });
};

export const adminUpdate = async (req, res) => {
  const { id } = req.params;
  const patch = { ...req.body };
  if (patch.code) patch.code = String(patch.code).trim().toUpperCase();
  const doc = await Coupon.findByIdAndUpdate(id, { $set: patch }, { new: true });
  if (!doc) return res.status(404).json({ message: 'NOT_FOUND' });
  res.json({ coupon: doc });
};

export const adminDelete = async (req, res) => {
  const { id } = req.params;
  const doc = await Coupon.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ message: 'NOT_FOUND' });
  res.json({ message: 'Deleted' });
};
