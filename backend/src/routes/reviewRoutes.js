import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import {
  listReviews,
  createReview,
  adminListReviews,
  adminDeleteReview,
} from '../controllers/reviewController.js';

const router = Router();

/** Public */
router.get('/products/:idOrSlug/reviews', listReviews);
router.post('/products/:idOrSlug/reviews', /* authenticate (nếu muốn bắt buộc đăng nhập) */ createReview);

/** Admin */
router.get('/admin/reviews', /* authenticate, requireAdmin, */ adminListReviews);
router.delete('/admin/reviews/:id', /* authenticate, requireAdmin, */ adminDeleteReview);

export default router;
