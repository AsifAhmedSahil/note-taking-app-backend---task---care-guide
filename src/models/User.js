const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please provide a valid email address',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },
    interests: {
      type: [String],
      default: [],
      set: (values) => values.map((value) => value.trim()),
    },
  },
  {
    timestamps: true,
  }
);

// Unique index on email: supports fast login lookup by email and enforces
// that no two users can share the same email address.
userSchema.index({ email: 1 }, { unique: true });

userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);