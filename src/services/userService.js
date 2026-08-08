const bcrypt = require('bcryptjs');

const User = require('../models/User');

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

const listUsers = async () => {
  return User.find().sort({ createdAt: -1 });
};

const getUserById = async (id) => {
  return User.findById(id);
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

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};