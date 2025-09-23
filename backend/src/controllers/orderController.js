// backend/src/controllers/orderController.js
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { computeDiscount, validateCoupon } from '../utils/coupon.js';
// tạo mã đơn đơn giản theo ngày
function genOrderCode() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rnd = Math.floor(Math.random() * 900 + 100); // 3 số
  return `ODR${y}${m}${day}-${rnd}`;
}

function calcSubtotal(items = []) {
  return items.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 0), 0);
}

/** ---- INVENTORY HELPERS ----
 * Giảm tồn khi tạo đơn; hoàn tồn khi huỷ.
 * Ưu tiên cập nhật trên variants nếu có size/color, nếu không thì dùng stock tổng.
 */
async function reduceStock(items) {
  for (const it of items) {
    const p = await Product.findById(it.productId);
    if (!p) throw Object.assign(new Error('Product not found'), { status: 400, code: 'PRODUCT_NOT_FOUND' });

    // nếu có variants
    if (Array.isArray(p.variants) && p.variants.length) {
      const idx = p.variants.findIndex(v =>
        (it.size ? v.size === it.size : true) &&
        (it.color ? v.color === it.color : true)
      );
      if (idx < 0) {
        throw Object.assign(new Error('Variant not found'), { status: 400, code: 'VARIANT_NOT_FOUND' });
      }
      if ((p.variants[idx].stock || 0) < it.qty) {
        throw Object.assign(new Error('Out of stock'), { status: 400, code: 'OUT_OF_STOCK' });
      }
      p.variants[idx].stock -= it.qty;
    } else {
      if ((p.stock || 0) < it.qty) {
        throw Object.assign(new Error('Out of stock'), { status: 400, code: 'OUT_OF_STOCK' });
      }
      p.stock = (p.stock || 0) - it.qty;
    }
    await p.save();
  }
}

async function restoreStock(items) {
  for (const it of items) {
    const p = await Product.findById(it.productId);
    if (!p) continue;
    if (Array.isArray(p.variants) && p.variants.length) {
      const idx = p.variants.findIndex(v =>
        (it.size ? v.size === it.size : true) &&
        (it.color ? v.color === it.color : true)
      );
      if (idx >= 0) p.variants[idx].stock = (p.variants[idx].stock || 0) + it.qty;
    } else {
      p.stock = (p.stock || 0) + it.qty;
    }
    await p.save();
  }
}

async function increaseSold(items) {
  for (const it of items) {
    await Product.updateOne({ _id: it.productId }, { $inc: { sold: it.qty } });
  }
}

/** --------- USER APIs --------- */

// POST /orders  (Bearer)
export const createOrder = async (req, res) => {
  const { items = [], shippingAddress, note, couponCode } = req.body || {};

  // validate tối thiểu
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'items is required' });
  }
  if (items.some(it => !it.productId)) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Each item must have productId' });
  }
  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.address) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'shippingAddress incomplete' });
  }

  // tính tiền
  const subtotal = calcSubtotal(items);

  // [COUPON] áp mã nếu có
  let discount = 0;
  let couponInfo = null;
  if (couponCode) {
    const code = String(couponCode).trim().toUpperCase();
    const cp = await Coupon.findOne({ code });
    const check = validateCoupon(cp, { subtotal });
    if (!check.ok) {
      return res.status(400).json({ code: 'COUPON_INVALID', message: check.reason });
    }
    discount = computeDiscount(subtotal, cp);
    couponInfo = { code: cp.code, type: cp.type, value: cp.value, discountApplied: discount };
    if (cp.usageLimit) {
      cp.usedCount = (cp.usedCount || 0) + 1;
      await cp.save();
    }
  }

  const total = Math.max(0, subtotal - discount);

  // giảm tồn (nếu thiếu sẽ throw)
  await reduceStock(items);

  // ❗️KHÔNG dùng biến tên "order" trước khi gán — build doc riêng
  const doc = {
    code: genOrderCode(),
    userId: req.user?.sub || null,
    items,
    subtotal,
    discount,
    total,
    coupon: couponInfo,
    couponCode,
    shippingAddress,
    note,
    status: 'pending',
    timeline: [{ status: 'pending', note: 'Order created' }],
  };

  // lưu và trả về
  const savedOrder = await Order.create(doc);
  res.status(201).json({ order: savedOrder });
};


// GET /orders/my  (Bearer)
export const myOrders = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  const [items, total] = await Promise.all([
    Order.find({ userId: req.user.sub })
      .sort({ createdAt: -1 })
      .skip(skip).limit(lim)
      .select('_id code total status createdAt')
      .lean(),
    Order.countDocuments({ userId: req.user.sub }),
  ]);

  res.json({ items, pagination: { page: pg, limit: lim, total } });
};

// GET /orders/:id  (Bearer – chỉ chủ đơn xem)
export const getMyOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id, userId: req.user.sub }).lean();
  if (!order) return res.status(404).json({ code: 'NOT_FOUND', message: 'Order not found' });
  res.json({ order });
};

// PATCH /orders/:id/cancel  (Bearer – chỉ khi pending|confirmed)
export const cancelMyOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id, userId: req.user.sub });
  if (!order) return res.status(404).json({ code: 'NOT_FOUND', message: 'Order not found' });

  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(400).json({ code: 'CANNOT_CANCEL', message: 'Order cannot be canceled at this stage' });
  }

  // hoàn tồn khi huỷ
  await restoreStock(order.items);

  order.status = 'canceled';
  order.timeline.push({ status: 'canceled', note: 'User canceled' });
  await order.save();

  res.json({ order });
};

/** --------- ADMIN APIs --------- */

// GET /admin/orders
export const adminListOrders = async (req, res) => {
  const { q, status, from, to, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  if (q) {
    filter.$or = [
      { code: { $regex: q, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: q, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: q, $options: 'i' } },
    ];
  }

  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip).limit(lim)
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.json({ items, pagination: { page: pg, limit: lim, total } });
};

// GET /admin/orders/:id
export const adminGetOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).lean();
  if (!order) return res.status(404).json({ code: 'NOT_FOUND', message: 'Order not found' });
  res.json({ order });
};

// PATCH /admin/orders/:id/status  { status, note? }
export const adminUpdateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body || {};
  const allow = ['pending', 'confirmed', 'shipping', 'completed', 'canceled'];
  if (!allow.includes(status)) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid status' });
  }

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ code: 'NOT_FOUND', message: 'Order not found' });

  // nếu admin hủy → hoàn tồn
  if (status === 'canceled' && !['canceled'].includes(order.status)) {
    await restoreStock(order.items);
  }

  // khi hoàn tất → tăng sold
  const goingCompleted = status === 'completed' && order.status !== 'completed';
  order.status = status;
  order.timeline.push({ status, note });

  await order.save();
  if (goingCompleted) await increaseSold(order.items);

  res.json({ order });
};
