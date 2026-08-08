const express = require('express');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
  });
});

// Centralized error handler stub
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;