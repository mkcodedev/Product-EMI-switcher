import mongoose from 'mongoose';

let gfsBucket = null;
let dbReady = false;

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('FATAL: MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    dbReady = true;

    const db = mongoose.connection.db;
    gfsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'mediaUploads'
    });

    return conn;
  } catch (error) {
    dbReady = false;
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

export const getGridFSBucket = () => {
  if (!gfsBucket) {
    throw new Error('GridFS Bucket has not been initialized yet.');
  }
  return gfsBucket;
};

export const isDBReady = () => dbReady && mongoose.connection.readyState === 1;