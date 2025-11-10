import mongoose from 'mongoose';

export const connectMongoDB = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl, {
    
    });
    console.log('✅ MongoDB connection established successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};
