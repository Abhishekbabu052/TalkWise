const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pack = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, token: sign(u._id) });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already registered' });
    res.status(201).json(pack(await User.create({ name, email, password })));
  } catch (e) { res.status(500).json({ message: e.message }); }
};
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
    if (!user || !(await user.matchPassword(req.body.password || ''))) return res.status(401).json({ message: 'Invalid email or password' });
    if (user.isBlocked) return res.status(403).json({ message: 'Your account has been blocked' });
    res.json(pack(user));
  } catch (e) { res.status(500).json({ message: e.message }); }
};
exports.me = (req, res) => res.json(req.user);
