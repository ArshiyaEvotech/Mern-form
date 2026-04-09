const express = require('express');
const cors = require('cors');

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

module.exports = app;
