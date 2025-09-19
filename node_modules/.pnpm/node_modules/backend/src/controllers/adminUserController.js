import { User } from '../models/User.js';

export const adminListUsers = async (req, res) => {
  const { q, role, status, page = 1, limit = 12, sort = 'latest' } = req.query;
  const filter = {};
  if (q) {
    const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  if (role) filter.role = role;
  if (status) filter.status = status;

  const sortMap = { latest: { createdAt: -1 }, oldest: { createdAt: 1 }, name: { name: 1 } };
  const total = await User.countDocuments(filter);
  const items = await User.find(filter)
    .select('_id name email role status createdAt')
    .sort(sortMap[sort] || sortMap.latest)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
};

export const adminGetUser = async (req, res) => {
  const u = await User.findById(req.params.id).select('_id name email role status createdAt updatedAt');
  if (!u) {
    const err = new Error('User not found');
    err.status = 404; err.code = 'NOT_FOUND';
    throw err;
  }
  res.json({ user: u });
};

export const adminUpdateUser = async (req, res) => {
  const { id } = req.params;
  const me = req.user?.sub?.toString();
  const payload = { ...req.body };

  if (payload.email) payload.email = payload.email.trim().toLowerCase();

  // Không cho tự hạ quyền / tự block để tránh khoá admin duy nhất
  if (me === id) {
    if (payload.role && payload.role !== 'admin') {
      const err = new Error('Cannot change your own role');
      err.status = 400; err.code = 'CANNOT_SELF_DEMOTE';
      throw err;
    }
    if (payload.status && payload.status !== 'active') {
      const err = new Error('Cannot block yourself');
      err.status = 400; err.code = 'CANNOT_SELF_BLOCK';
      throw err;
    }
  }

  // Nếu đổi email -> kiểm tra trùng
  if (payload.email) {
    const exists = await User.findOne({ email: payload.email, _id: { $ne: id } }).select('_id');
    if (exists) {
      const err = new Error('Email already exists');
      err.status = 409; err.code = 'EMAIL_TAKEN';
      throw err;
    }
  }

  const u = await User.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  ).select('_id name email role status createdAt updatedAt');

  if (!u) {
    const err = new Error('User not found');
    err.status = 404; err.code = 'NOT_FOUND';
    throw err;
  }
  res.json({ user: u });
};

export const adminDeleteUser = async (req, res) => {
  const { id } = req.params;
  const me = req.user?.sub?.toString();

  if (me === id) {
    const err = new Error('Cannot delete yourself');
    err.status = 400; err.code = 'CANNOT_SELF_DELETE';
    throw err;
  }

  const u = await User.findByIdAndDelete(id);
  if (!u) {
    const err = new Error('User not found');
    err.status = 404; err.code = 'NOT_FOUND';
    throw err;
  }
  res.json({ message: 'Deleted' });
};
