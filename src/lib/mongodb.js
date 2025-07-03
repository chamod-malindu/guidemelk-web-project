import mongoose from 'mongoose';

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Check if MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Use global variable to cache connection
let cached = global.mongoose;

// Initialize cache if not exists
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if no cached promise exists
  if (!cached.promise) {
    // MongoDB connection options
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // Create mongoose connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    // Wait for connection to complete
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    // Reset promise on failure
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;