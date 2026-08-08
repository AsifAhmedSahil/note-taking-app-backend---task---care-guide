import mongoose from 'mongoose';

import Post from '../models/Post.js';

const getPostsByUser = async (userId) => {
  return Post.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'author',
      },
    },
    { $unwind: '$author' },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        createdAt: 1,
        author: {
          id: '$author._id',
          name: '$author.name',
          email: '$author.email',
        },
      },
    },
  ]);
};

export { getPostsByUser };