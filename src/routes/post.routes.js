import express from 'express';

import * as postController from '../controllers/postController.js';

const router = express.Router();

router.get('/user/:userId', postController.getPostsByUser);

export default router;