const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 VS Food Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Ready to receive requests at http://localhost:${PORT}/api`);
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    console.error(`💥 Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
