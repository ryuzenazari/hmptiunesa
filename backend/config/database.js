const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB terhubung');
    return true;
  } catch (error) {
    console.error('Kesalahan koneksi MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 