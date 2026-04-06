const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const connectDB = require('./config/db');
const User = require('./models/User');

const defaultUsers = [
  {
    email: 'admin@evotech.global',
    password: 'Evotech@123',
    role: 'admin'
  },
  {
    email: 'user@evotech.global',
    password: 'Evotech@123',
    role: 'user'
  }
];

const seedUsers = async ({ connect = true } = {}) => {
  try {
    if (connect) {
      await connectDB();
    }

    for (const userData of defaultUsers) {
      const existing = await User.findOne({ email: userData.email });

      if (!existing) {
        const user = new User(userData);
        await user.save();
        console.log(`Created ${userData.email}`);
        continue;
      }

      existing.password = userData.password;
      existing.role = userData.role;
      await existing.save();
      console.log(`Reset ${userData.email}`);
    }

    console.log('Seeding complete');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

if (require.main === module) {
  seedUsers()
    .finally(() => {
      process.exit(0);
    });
}

module.exports = seedUsers;
