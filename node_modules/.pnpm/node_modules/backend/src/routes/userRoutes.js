import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { updateMeSchema } from '../validators/userSchemas.js';
import { updateMe } from '../controllers/userController.js';
import { me } from '../controllers/authController.js';


const router = Router();


router.get('/users/me', authenticate, me); // alias for GET profile
router.patch('/users/me', authenticate, validate(updateMeSchema), updateMe);


export default router;