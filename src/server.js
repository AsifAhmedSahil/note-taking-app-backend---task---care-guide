import 'dotenv/config';

import connectDB from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});