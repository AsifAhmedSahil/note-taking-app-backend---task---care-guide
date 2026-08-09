import mongoose from 'mongoose';

let connectionPromise = null;

const connectDB = () => {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => {
        console.log('MongoDB connected');
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error('MongoDB connection failed:', error.message);
        throw error;
      });
  }
  return connectionPromise;
};

export default connectDB;