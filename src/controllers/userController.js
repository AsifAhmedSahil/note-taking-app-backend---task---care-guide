import mongoose from 'mongoose';

import * as userService from '../services/userService.js';
import { getPaginationParams } from '../utils/pagination.js';
import {
  isNonEmptyString,
  isValidEmail,
  isArrayOfStrings,
  isValidRole,
} from '../utils/validate.js';

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

    if (
      !isNonEmptyString(name) ||
      !isValidEmail(email) ||
      !isNonEmptyString(password)
    ) {
      return res.status(400).json({
        success: false,
        message: 'A valid name, email and password are required.',
      });
    }

    if (!isValidRole(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either user or admin.',
      });
    }

    if (!isArrayOfStrings(interests)) {
      return res.status(400).json({
        success: false,
        message: 'Interests must be an array of strings.',
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
    const { page, limit, skip } = getPaginationParams(req.query);
    const { users, total } = await userService.listUsers({ page, limit, skip });
    res.status(200).json({
      success: true,
      data: users.map(sanitizeUser),
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

const isValidUserId = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid user id.',
    });
    return false;
  }
  return true;
};

const getUserById = async (req, res, next) => {
  try {
    if (!isValidUserId(req, res)) return;
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

const getUsersByInterest = async (req, res, next) => {
  try {
    const groups = await userService.getUsersByInterest();
    res.status(200).json({
      success: true,
      data: groups.map((group) => ({
        interest: group._id,
        count: group.count,
        users: group.users,
      })),
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (!isValidUserId(req, res)) return;
    const allowedFields = ['name', 'email', 'password', 'role', 'interests'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.name !== undefined && !isNonEmptyString(updates.name)) {
      return res.status(400).json({
        success: false,
        message: 'Name must be a non-empty string.',
      });
    }
    if (updates.email !== undefined && !isValidEmail(updates.email)) {
      return res.status(400).json({
        success: false,
        message: 'A valid email is required.',
      });
    }
    if (updates.password !== undefined && !isNonEmptyString(updates.password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be a non-empty string.',
      });
    }
    if (updates.role !== undefined && !isValidRole(updates.role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either user or admin.',
      });
    }
    if (updates.interests !== undefined && !isArrayOfStrings(updates.interests)) {
      return res.status(400).json({
        success: false,
        message: 'Interests must be an array of strings.',
      });
    }

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
    if (!isValidUserId(req, res)) return;
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

export {
  createUser,
  listUsers,
  getUserById,
  getUsersByInterest,
  updateUser,
  deleteUser,
};