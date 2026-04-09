const connectDB = require('../backend/config/db');
const app = require('../backend/app');
const seedUsers = require('../backend/seed');

let initPromise = null;

const initializeApi = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await seedUsers({ connect: false });
    })().catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  return initPromise;
};

module.exports = async (req, res) => {
  try {
    await initializeApi();
    return app(req, res);
  } catch (error) {
    console.error('API startup failed:', error.message);
    return res.status(500).json({
      message: 'Backend server failed to start.'
    });
  }
};
