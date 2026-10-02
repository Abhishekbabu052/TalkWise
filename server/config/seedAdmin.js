require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!process.env.MONGO_URI || !email || !password) {
    throw new Error('MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD must be configured');
  }

  await mongoose.connect(process.env.MONGO_URI);
  let user = await User.findOne({ email });
  const created = !user;
  if (!user) user = new User({ name: 'Admin', email });
  user.password = password;
  user.role = 'admin';
  await user.save();
  console.log(created ? `Admin created: ${email}` : `Admin password reset: ${email}`);
};

seedAdmin()
  .catch((err) => {
    console.error('Admin seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
