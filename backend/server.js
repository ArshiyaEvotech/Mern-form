const path = require('path');
const app = require('./app');
const connectDB = require('./config/db');
const seedUsers = require('./seed');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedUsers({ connect: false });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
