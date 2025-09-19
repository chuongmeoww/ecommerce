// import { Router } from 'express';
// import { listCategories, getCategoryBySlug, createCategory, updateCategory } from '../controllers/categoryController.js';
// // import { authenticate, requireAdmin } from '../middlewares/auth.js'; // nếu có

// const router = Router();

// router.get('/categories', listCategories);
// router.get('/categories/:slug', getCategoryBySlug);

// // Admin (bật khi có auth)
// // router.post('/admin/categories', authenticate, requireAdmin, createCategory);
// // router.patch('/admin/categories/:id', authenticate, requireAdmin, updateCategory);

// export default router;
// backend/src/routes/categoryRoutes.js
import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import {
  listCategories,
  getCategoryBySlug,
  adminListCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = Router();

// Public
router.get('/categories', listCategories);
router.get('/categories/:slug', getCategoryBySlug);

// Admin
router.get('/admin/categories', authenticate, requireAdmin, adminListCategories);
router.post('/admin/categories', authenticate, requireAdmin, createCategory);
router.patch('/admin/categories/:id', authenticate, requireAdmin, updateCategory);
router.delete('/admin/categories/:id', authenticate, requireAdmin, deleteCategory);

export default router;
