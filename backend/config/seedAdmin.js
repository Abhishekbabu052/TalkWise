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

    const usedLabels = new Set(await User.distinct('adminLabel', { role: 'admin', email: { $ne: ADMIN_EMAIL } }));
    let labelIndex = 0;
    while (usedLabels.has(labelIndex === 0 ? 'Admin' : `Admin${labelIndex}`)) labelIndex += 1;
    const adminLabel = labelIndex === 0 ? 'Admin' : `Admin${labelIndex}`;

    if (admin) {
      admin.name = 'Admin';
      admin.role = 'admin';
      admin.adminLabel = admin.adminLabel || adminLabel;
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
        adminLabel,
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