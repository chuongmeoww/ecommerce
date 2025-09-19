// backend/src/routes/adminOrderRoutes.js
import { Router } from 'express';
import { adminListOrders, adminGetOrder, adminUpdateStatus, adminCancelOrder } from '../controllers/adminOrderController.js';
// import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Khi lên prod nhớ bật middleware:
// router.use(authenticate, requireAdmin);

router.get('/admin/orders', adminListOrders);
router.get('/admin/orders/:id', adminGetOrder);
router.patch('/admin/orders/:id', adminUpdateStatus);
router.post('/admin/orders/:id/cancel', adminCancelOrder);

export default router;
