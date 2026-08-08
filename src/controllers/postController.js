const mongoose = require('mongoose');

const postService = require('../services/postService');

const getPostsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id.',
      });
    }

    const posts = await postService.getPostsByUser(userId);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPostsByUser };