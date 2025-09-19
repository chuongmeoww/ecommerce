import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { adminUpdateUserSchema } from '../validators/userSchemas.js';
import { adminListUsers, adminGetUser, adminUpdateUser, adminDeleteUser } from '../controllers/adminUserController.js';

const router = Router();

// /api/admin/users...
router.get('/admin/users', authenticate, requireAdmin, adminListUsers);
router.get('/admin/users/:id', authenticate, requireAdmin, adminGetUser);
router.patch('/admin/users/:id', authenticate, requireAdmin, validate(adminUpdateUserSchema), adminUpdateUser);
router.delete('/admin/users/:id', authenticate, requireAdmin, adminDeleteUser);

export default router;
