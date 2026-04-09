const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not set. Add it to your environment variables before starting the server.');
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(mongoUri);
    }

    await connectionPromise;
    console.log('MongoDB Connected...');
    return mongoose.connection;
  } catch (err) {
    connectionPromise = null;
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
    throw err;
  }
};
module.exports = connectDB;
