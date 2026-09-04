import mongoose from 'mongoose';

let gfsBucket = null;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const db = mongoose.connection.db;
    gfsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'mediaUploads'
    });
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const getGridFSBucket = () => {
  if (!gfsBucket) {
    throw new Error('GridFS Bucket has not been initialized yet.');
  }
  return gfsBucket;
};