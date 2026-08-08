const express = require('express');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const noteRoutes = require('./routes/note.routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', noteRoutes);

// Centralized error handler stub
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;