import app from '../src/app.js';
import connectDB from '../src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('MongoDB connection failed during request:', error.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: false, message: 'Something went wrong.' }));
  }
}
