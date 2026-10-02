require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL;
  if (await User.findOne({ email })) { console.log('Admin exists'); process.exit(); }
  await User.create({ name: 'Admin', email, password: process.env.ADMIN_PASSWORD, role: 'admin' });
  console.log('Admin created:', email);
  process.exit();
})();
