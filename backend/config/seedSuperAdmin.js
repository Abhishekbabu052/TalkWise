require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');
const User = require('../models/User');

const email = (process.env.SUPERADMIN_EMAIL || 'super@gmail.com').trim().toLowerCase();
const password = process.env.SUPERADMIN_PASSWORD || '123456';

async function createSuperAdmin() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be set');
    await mongoose.connect(process.env.MONGO_URI);
    let user = await User.findOne({ email });
    if (!user) user = new User({ email, name: 'Superadmin' });
    user.name = 'Superadmin';
    user.role = 'superadmin';
    user.adminLabel = undefined;
    user.isBlocked = false;
    user.password = password;
    await user.save();
    console.log(`Superadmin account ready: ${email}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating superadmin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createSuperAdmin();
