// backend/src/routes/orderRoutes.js
import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import {
  createOrder, myOrders, getMyOrder, cancelMyOrder,
  adminListOrders, adminGetOrder, adminUpdateStatus,
} from '../controllers/orderController.js';

const router = Router();

/** User */
router.post('/orders', authenticate, createOrder);
router.get('/orders/my', authenticate, myOrders);
router.get('/orders/:id', authenticate, getMyOrder);
router.patch('/orders/:id/cancel', authenticate, cancelMyOrder);

/** Admin */
router.get('/admin/orders', authenticate, requireAdmin, adminListOrders);
router.get('/admin/orders/:id', authenticate, requireAdmin, adminGetOrder);
router.patch('/admin/orders/:id/status', authenticate, requireAdmin, adminUpdateStatus);

export default router;
