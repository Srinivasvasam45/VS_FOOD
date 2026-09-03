const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;

    if (!connUri) {
      console.error('❌ MONGODB_URI is not defined in environment variables.');
      console.error('👉 Please update backend/.env with your MongoDB connection string.');
      process.exit(1);
    }

    const conn = await mongoose.connect(connUri);

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 Check your connection string, network access, or MongoDB Atlas IP whitelist.');
    // Fail gracefully with exit code 1
    process.exit(1);
  }
};

module.exports = connectDB;
