import express from 'express';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import noteRoutes from './routes/note.routes.js';
import postRoutes from './routes/post.routes.js';
import errorHandler from './middleware/errorHandler.js';

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
app.use('/api/posts', postRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

app.use(errorHandler);

export default app;