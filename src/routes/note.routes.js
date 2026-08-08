const express = require('express');

const noteController = require('../controllers/noteController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorize');

const router = express.Router();

router.get('/admin/notes', protect, requireAdmin, noteController.listAllNotes);

router.post('/notes', protect, noteController.createNote);
router.get('/notes', protect, noteController.listMyNotes);
router.get('/notes/:id', protect, noteController.getMyNote);
router.patch('/notes/:id', protect, noteController.updateMyNote);
router.delete('/notes/:id', protect, noteController.deleteMyNote);

module.exports = router;