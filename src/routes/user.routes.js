const express = require('express');

const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorize');

const router = express.Router();

router.use(protect, requireAdmin);

router.post('/', userController.createUser);
router.get('/', userController.listUsers);
router.get('/interests', userController.getUsersByInterest);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;