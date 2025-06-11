import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let isEventListenersSet = false;

export default async function dbConnect() {
  // Set up event listeners for connection status
  if (!isEventListenersSet) {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully!');
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected.');
    });
    isEventListenersSet = true;
  }

  // If already connected or connecting, do nothing
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI);

  } catch (error) {
    console.error('Initial MongoDB connection error:', error);
    throw error;
  }
}
