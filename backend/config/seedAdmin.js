require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

const ADMIN_EMAIL = 'admin@talkwise.com';
const ADMIN_PASSWORD = 'Admin@123';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('MongoDB connected');

    let admin = await User.findOne({ email: ADMIN_EMAIL });

    if (admin) {
      admin.name = 'Admin';
      admin.role = 'admin';
      admin.isBlocked = false;
      admin.password = ADMIN_PASSWORD;

      await admin.save();

      console.log('Admin account updated successfully');
    } else {
      admin = await User.create({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        isBlocked: false,
        warnings: 0,
      });

      console.log('Admin account created successfully');
    }

    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log('Password: Admin@123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();