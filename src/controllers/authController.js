import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import {
  isNonEmptyString,
  isValidEmail,
  isArrayOfStrings,
} from '../utils/validate.js';

const register = async (req, res, next) => {
  try {
    const { name, email, password, interests, role } = req.body;

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

    if (interests !== undefined && !isArrayOfStrings(interests)) {
      return res.status(400).json({
        success: false,
        message: 'Interests must be an array of strings.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Public registration always creates a "user" account.
    // For local development/testing, ALLOW_ADMIN_REGISTRATION=true allows
    // bootstrapping an admin. Default is false so production stays locked down.
    const allowAdminRegistration = process.env.ALLOW_ADMIN_REGISTRATION === 'true';
    const userRole = allowAdminRegistration && role ? role : 'user';

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      interests: interests || [],
      role: userRole,
    });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !isNonEmptyString(password)) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = signToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
      },
    });
  } catch (err) {
    next(err);
  }
};

export { register, login };