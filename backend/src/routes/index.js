

import { Router } from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import adminUserRoutes from './adminUserRoutes.js';
import userRoutes from './userRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import orderRoutes from './orderRoutes.js';
import adminOrderRoutes from './adminOrderRoutes.js';
import couponRoutes from './couponRoutes.js';
import metaRoutes from './metaRoutes.js';
import uploadRoutes from './uploadRoutes.js';
const router = Router();
router.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
router.use('/auth', authRoutes);


// public + admin products
router.use('/', productRoutes);
router.use('/', reviewRoutes);
router.use('/', categoryRoutes);
router.use('/', orderRoutes);
router.use('/', couponRoutes);
router.use('/meta', metaRoutes);
router.use('/', uploadRoutes); 
// admin users
router.use('/', adminUserRoutes);
router.use('/', adminOrderRoutes);
// me/profile
router.use('/', userRoutes);
export default router;