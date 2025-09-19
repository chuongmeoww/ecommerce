import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'change-me';
const EXPIRES = process.env.JWT_EXPIRES || '1h';

export const signToken = (payload, options = {}) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES, ...options });

export const verifyToken = (token) => jwt.verify(token, SECRET);
