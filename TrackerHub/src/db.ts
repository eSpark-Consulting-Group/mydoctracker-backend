const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log('DB connected successfully! ✅');
  } catch (error) {
    console.log('⚠ Error in DB conenction -->:', error);
  }
};

export default connectDB;
