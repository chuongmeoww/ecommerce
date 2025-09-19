import crypto from 'node:crypto';
export function tokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
