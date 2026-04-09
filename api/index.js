const connectDB = require('../backend/config/db');
const app = require('../backend/app');

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('API startup failed:', error.message);
    return res.status(500).json({
      message: 'Backend server failed to start.'
    });
  }
};
