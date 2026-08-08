import bcrypt from 'bcryptjs';

import User from '../models/User.js';

const createUser = async ({ name, email, password, role, interests }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({
    name,
    email,
    password: hashedPassword,
    role,
    interests,
  });
};

const listUsers = async ({ page, limit, skip }) => {
  const filter = {};
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return { users, total };
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUsersByInterest = async () => {
  return User.aggregate([
    { $unwind: '$interests' },
    {
      $group: {
        _id: '$interests',
        count: { $sum: 1 },
        users: { $push: { id: '$_id', name: '$name' } },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const updateUser = async (id, updates) => {
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  return User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
};

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

export {
  createUser,
  listUsers,
  getUserById,
  getUsersByInterest,
  updateUser,
  deleteUser,
};