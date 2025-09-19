




// backend/src/routes/productRoutes.js
import { Router } from 'express';
import {
  listProducts,
  getProduct,
  relatedProducts,
  suggestions,
  // admin
  adminList,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  bulkUpsert,
} from '../controllers/productController.js';
// import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = Router();

/** Public */
router.get('/products', listProducts);
router.get('/products/suggest', suggestions);
router.get('/products/:idOrSlug', getProduct);
router.get('/products/:idOrSlug/related', relatedProducts);

/** Admin (bật middleware thật khi bạn sẵn sàng) */
// router.get('/admin/products', authenticate, requireAdmin, adminList);
// router.post('/admin/products', authenticate, requireAdmin, createProduct);
// router.patch('/admin/products/:id', authenticate, requireAdmin, updateProduct);
// router.delete('/admin/products/:id', authenticate, requireAdmin, deleteProduct);
// router.post('/admin/products/:id/toggle-featured', authenticate, requireAdmin, toggleFeatured);
// router.post('/admin/products/bulk-upsert', authenticate, requireAdmin, bulkUpsert);

// TẠM TEST (nếu chưa bật auth), comment lại khi lên prod:
router.get('/admin/products', adminList);
router.post('/admin/products', createProduct);
router.patch('/admin/products/:id', updateProduct);
router.delete('/admin/products/:id', deleteProduct);
router.post('/admin/products/:id/toggle-featured', toggleFeatured);
router.post('/admin/products/bulk-upsert', bulkUpsert);

export default router;
