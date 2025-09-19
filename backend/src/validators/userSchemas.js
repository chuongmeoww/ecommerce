import { z } from 'zod';

export const adminUpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['user', 'admin']).optional(),
  status: z.enum(['active', 'blocked']).optional()
});






export const updateMeSchema = z.object({
name: z.string().min(2).max(100).optional(),
avatarUrl: z.string().url().optional(),
phone: z.string().min(6).max(20).optional(),
address: z.string().max(200).optional(),
dob: z.preprocess((v) => (v ? new Date(String(v)) : undefined), z.date()).optional(),
gender: z.enum(['male','female','other']).optional()
});