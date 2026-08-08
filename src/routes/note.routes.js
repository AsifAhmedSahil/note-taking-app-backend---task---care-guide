import express from 'express';

import * as noteController from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/authorize.js';

const router = express.Router();

router.get('/admin/notes', protect, requireAdmin, noteController.listAllNotes);

router.post('/notes', protect, noteController.createNote);
router.get('/notes', protect, noteController.listMyNotes);
router.get('/notes/:id', protect, noteController.getMyNote);
router.patch('/notes/:id', protect, noteController.updateMyNote);
router.delete('/notes/:id', protect, noteController.deleteMyNote);

export default router;