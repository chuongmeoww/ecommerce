// backend/src/controllers/adminOrderController.js
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

function buildFilter(qs) {
  const { q, status, from, to, userId } = qs;
  const filter = {};
  if (status) filter.status = status;
  if (userId) filter.userId = userId;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  if (q) {
    filter.$or = [
      { code: new RegExp(q, 'i') },
      { 'shippingAddress.fullName': new RegExp(q, 'i') },
      { 'shippingAddress.phone': new RegExp(q, 'i') },
      { 'shippingAddress.email': new RegExp(q, 'i') },
    ];
  }
  return filter;
}

export const adminListOrders = async (req, res) => {
  const { page = 1, limit = 20, sort = 'latest', q, status, from, to, userId } = req.query;
  const filter = buildFilter({ q, status, from, to, userId });
  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  const sortMap = {
    latest: { createdAt: -1 },
    amount_desc: { total: -1 },
    amount_asc: { total: 1 },
    status: { status: 1, createdAt: -1 },
  };

  const [items, total, sums] = await Promise.all([
    Order.find(filter)
      .select('_id code userId total status paid createdAt')
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip).limit(lim)
      .lean(),
    Order.countDocuments(filter),
    Order.aggregate([
      { $match: filter },
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, count: { $sum: 1 } } }
    ])
  ]);

  res.json({
    items,
    pagination: { page: pg, limit: lim, total },
    stats: sums?.[0] || { totalRevenue: 0, count: 0 }
  });
};

export const adminGetOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).lean();
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
};

export const adminUpdateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, paid } = req.body;

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (status) {
    order.status = status;
    const now = new Date();
    if (status === 'confirmed' && !order.confirmedAt) order.confirmedAt = now;
    if (status === 'shipped' && !order.shippedAt) order.shippedAt = now;
    if (status === 'delivered' && !order.deliveredAt) order.deliveredAt = now;
    if (status === 'cancelled' && !order.cancelledAt) order.cancelledAt = now;
    if (status === 'refunded' && !order.refundedAt) order.refundedAt = now;
  }
  if (typeof paid === 'boolean') order.paid = paid;

  await order.save();
  res.json({ order });
};

// (tuỳ chọn) huỷ và refilling stock (nếu bạn có quản lý tồn kho)
export const adminCancelOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (['delivered','refunded','cancelled'].includes(order.status)) {
    return res.status(400).json({ message: 'Order not cancellable' });
  }

  // ví dụ: trả lại stock (chỉ minh hoạ — chỉnh theo schema Product/variants của bạn)
  for (const it of order.items) {
    await Product.updateOne(
      { _id: it.productId },
      { $inc: { stock: it.qty * 1 } }
    );
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  await order.save();
  res.json({ order });
};
