const express = require('express');

const postController = require('../controllers/postController');

const router = express.Router();

router.get('/user/:userId', postController.getPostsByUser);

module.exports = router;