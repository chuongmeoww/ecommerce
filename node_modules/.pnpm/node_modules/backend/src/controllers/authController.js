import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { randomToken } from '../utils/randomToken.js';
import { tokenHash } from '../utils/tokenHash.js';

/* REGISTER */
// export const register = async (req, res) => {
//   const { name, email, password } = req.body;

//   const exists = await User.findOne({ email });
//   if (exists) {
//     const err = new Error('Email already exists');
//     err.status = 409; err.code = 'EMAIL_TAKEN';
//     throw err;
//   }

//   const passwordHash = await bcrypt.hash(password, 10);
//   const user = await User.create({ name, email, passwordHash });
//   const token = signToken({ sub: user._id, email: user.email, role: user.role });

//   res.status(201).json({
//     user: { id: user._id, name: user.name, email: user.email, role: user.role },
//     token,
//   });
// };
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const emailNorm = (email || '').trim().toLowerCase();

  const exists = await User.findOne({ email: emailNorm });
  if (exists) {
    const err = new Error('Email already exists');
    err.status = 409; err.code = 'EMAIL_TAKEN';
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: emailNorm, passwordHash });
  const token = signToken({ sub: user._id, email: user.email, role: user.role });

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
};
/* LOGIN */
// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await user.comparePassword(password))) {
//     const err = new Error('Invalid email or password');
//     err.status = 401; err.code = 'INVALID_CREDENTIALS';
//     throw err;
//   }
//   if (user.status !== 'active') {
//     const err = new Error('User inactive');
//     err.status = 403; err.code = 'USER_INACTIVE';
//     throw err;
//   }

//   const token = signToken({ sub: user._id, email: user.email, role: user.role });
//   res.json({
//     user: { id: user._id, name: user.name, email: user.email, role: user.role },
//     token,
//   });
// };
export const login = async (req, res) => {
  const { email, password } = req.body;
  const emailNorm = (email || '').trim().toLowerCase();

  const user = await User.findOne({ email: emailNorm });
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password');
    err.status = 401; err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  if (user.status !== 'active') {
    const err = new Error('User inactive');
    err.status = 403; err.code = 'USER_INACTIVE';
    throw err;
  }

  const token = signToken({ sub: user._id, email: user.email, role: user.role });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

/* ME */
// export const me = async (req, res) => {
//   const user = await User.findById(req.user.sub).select('_id name email role status createdAt');
//   res.json({ user });
// };

export const me = async (req, res) => {
 const user = await User
 .findById(req.user.sub)
 .select('_id name email role status avatarUrl phone address dob gender createdAt');
res.json({ user });
};

/* FORGOT PASSWORD (hash token + dev trả link) */
export const forgotPassword = async (req, res) => {
  // const { email } = req.body;
  const emailNorm = (req.body.email || '').trim().toLowerCase();

  // Không lộ thông tin user tồn tại hay không
  // const user = await User.findOne({ email });
  const user = await User.findOne({ email: emailNorm });
  const ttlMin = Number(process.env.RESET_TOKEN_TTL_MIN || 15);

  if (!user) {
    return res.json({ message: 'If this email exists, a reset link has been prepared.' });
  }

  // Tạo token gốc & lưu HASH vào DB
  const tokenPlain = randomToken(24);
  user.resetPasswordToken = tokenHash(tokenPlain);
  user.resetPasswordExpires = new Date(Date.now() + ttlMin * 60 * 1000);
  await user.save();

  // Tạo URL an toàn
  const base = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
  const resetUrl = `${base}/reset?token=${encodeURIComponent(tokenPlain)}`;

  // DEV: trả token & url để test nhanh
  if (process.env.NODE_ENV !== 'production') {
    return res.json({
      message: `If this email exists, a reset link has been prepared (valid ${ttlMin} minutes).`,
      dev: { token: tokenPlain, resetUrl },
    });
  }

  // PROD: (chỗ này bạn gửi email rồi chỉ trả message)
  return res.json({ message: 'If this email exists, a reset link has been prepared.' });
};

/* RESET PASSWORD (nhận token PLAIN, so với HASH trong DB) */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: tokenHash(token),
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) {
    const err = new Error('Token invalid or expired');
    err.status = 400; err.code = 'INVALID_TOKEN';
    throw err;
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const jwt = signToken({ sub: user._id, email: user.email, role: user.role });
  res.json({ message: 'Password updated', token: jwt });
};

/* CHANGE PASSWORD (yêu cầu đăng nhập) */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.sub);
  if (!user) {
    const err = new Error('Unauthorized');
    err.status = 401; err.code = 'UNAUTHORIZED';
    throw err;
  }

  const ok = await user.comparePassword(currentPassword);
  if (!ok) {
    const err = new Error('Current password incorrect');
    err.status = 400; err.code = 'WRONG_PASSWORD';
    throw err;
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: 'Password changed' });
};
