import mongoose from 'mongoose';

import * as postService from '../services/postService.js';
import { getPaginationParams } from '../utils/pagination.js';

const getPostsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id.',
      });
    }

    const { page, limit, skip } = getPaginationParams(req.query);
    const { posts, total } = await postService.getPostsByUser({
      userId,
      page,
      limit,
      skip,
    });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export { getPostsByUser };