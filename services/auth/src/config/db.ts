import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using the URI from environment variables.
 * Includes basic error handling and connection event listeners.
 */
const connect_db = async () => {
  try {
    const mongo_uri = process.env.MONGO_URI;

    if (!mongo_uri) {
      console.error('Error: MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongo_uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connect_db;
