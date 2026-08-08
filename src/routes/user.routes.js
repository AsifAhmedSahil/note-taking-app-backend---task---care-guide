import express from 'express';

import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.post('/', userController.createUser);
router.get('/', userController.listUsers);
router.get('/interests', userController.getUsersByInterest);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;