const userService = require('../services/userService');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  interests: user.interests,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user', interests = [] } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required.',
      });
    }

    const user = await userService.createUser({
      name,
      email,
      password,
      role,
      interests,
    });

    res.status(201).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await userService.listUsers();
    res.status(200).json({
      success: true,
      users: users.map(sanitizeUser),
    });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'email', 'password', 'role', 'interests'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await userService.updateUser(req.params.id, updates);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};