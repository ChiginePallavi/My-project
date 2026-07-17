import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 
 "MONGO_URI=mongodb+srv://pallavi_221206:pallavi%40221206@cluster0.rhi3tzj.mongodb.net/?appName=Cluster0"

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

export default connectDB;
