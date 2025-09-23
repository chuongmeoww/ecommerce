import { Router } from 'express';
import { applyCoupon, adminList, adminCreate, adminUpdate, adminDelete } from '../controllers/couponController.js';
// import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Public
router.post('/coupons/apply', applyCoupon);

// Admin (khi sẵn sàng bật auth)
// router.get('/admin/coupons', authenticate, requireAdmin, adminList);
// router.post('/admin/coupons', authenticate, requireAdmin, adminCreate);
// router.patch('/admin/coupons/:id', authenticate, requireAdmin, adminUpdate);
// router.delete('/admin/coupons/:id', authenticate, requireAdmin, adminDelete);

// Temp test (không auth)
router.get('/admin/coupons', adminList);
router.post('/admin/coupons', adminCreate);
router.patch('/admin/coupons/:id', adminUpdate);
router.delete('/admin/coupons/:id', adminDelete);

export default router;
