const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedUsers = require('./seed');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('MERN Form backend is running');
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'mern-form-backend'
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/forms', require('./routes/formRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

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
