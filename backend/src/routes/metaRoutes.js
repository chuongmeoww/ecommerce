// backend/src/routes/metaRoutes.js
import { Router } from 'express';
import { navFacets } from '../controllers/metaController.js';

const router = Router();

router.get('/nav', navFacets); // GET /api/meta/nav

export default router;
