const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not set. Add it to your environment variables before starting the server.');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');
  } catch (err) {
    const hints = [];

    if (/auth/i.test(err.message)) {
      hints.push('Check the MongoDB username/password in MONGO_URI.');
      hints.push('If the password contains special characters like @, :, /, or #, URL-encode it.');
      hints.push('If you are using MongoDB Atlas, confirm the database user still exists and has access to the target database.');
    }

    console.error('MongoDB connection failed:', err.message);
    for (const hint of hints) {
      console.error(`Hint: ${hint}`);
    }
    process.exit(1);
  }
};
module.exports = connectDB;
