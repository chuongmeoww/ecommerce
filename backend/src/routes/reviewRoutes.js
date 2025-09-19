// backend/src/routes/reviewRoutes.js
import { Router } from 'express';
import { listReviews, createReview, deleteReview } from '../controllers/reviewController.js';
// import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Public list
router.get('/products/:productId/reviews', listReviews);

// Auth user tạo review (khi có auth middleware)
// router.post('/products/:productId/reviews', authenticate, createReview);
// Admin xoá review
// router.delete('/admin/reviews/:reviewId', authenticate, requireAdmin, deleteReview);

// TẠM (không auth) để test dễ
router.post('/products/:productId/reviews', createReview);
router.delete('/admin/reviews/:reviewId', deleteReview);

export default router;
