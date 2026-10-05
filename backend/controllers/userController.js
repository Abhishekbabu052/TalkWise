const User = require('../models/User');
const Response = require('../models/Response');
const Post = require('../models/Post');
const Report = require('../models/Report');
const Keyword = require('../models/Keyword');
const Reaction = require('../models/Reaction');
const allocateAdminLabel = async () => {
  const labels = new Set(await User.distinct('adminLabel', { role: 'admin' }));
  let suffix = 0;
  while (labels.has(suffix === 0 ? 'Admin' : `Admin${suffix}`)) suffix += 1;
  return suffix === 0 ? 'Admin' : `Admin${suffix}`;
};

exports.getUsers = async (req, res) => {
  const users = await User.find({ role: { $ne: 'superadmin' } }).select('-password').sort('-createdAt');
  for (const user of users) {
    if (user.role === 'admin' && !user.adminLabel) {
      user.adminLabel = await allocateAdminLabel();
      await user.save();
    }
  }
  res.json(users);
};
exports.toggleBlock = async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: 'User not found' });
  if (u.role !== 'user') return res.status(400).json({ message: 'Staff accounts cannot be blocked here' });
  u.isBlocked = !u.isBlocked;
  await u.save();
  res.json(u);
};
exports.removeUser = async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: 'User not found' });
  if (u.role !== 'user') return res.status(400).json({ message: 'Staff accounts cannot be removed here' });
  await Response.deleteMany({ user: u._id });
  await Reaction.deleteMany({ user: u._id });
  await u.deleteOne();
  res.json({ message: 'User removed' });
};
exports.deleteMe = async (req, res) => {
  if (['admin', 'superadmin'].includes(req.user.role)) {
    const staffCount = await User.countDocuments({ role: req.user.role });
    if (staffCount <= 1) return res.status(400).json({ message: `The last ${req.user.role} account cannot be deleted` });
  }
  const responseIds = await Response.find({ user: req.user._id }).distinct('_id');
  await Promise.all([
    Response.deleteMany({ user: req.user._id }),
    Reaction.deleteMany({ user: req.user._id }),
    Report.deleteMany({ reporter: req.user._id }),
    Report.updateMany({ reportedUser: req.user._id }, { $unset: { reportedUser: 1 } }),
    Report.updateMany({ response: { $in: responseIds } }, { $unset: { response: 1 } }),
    Response.updateMany({ replyTo: { $in: responseIds } }, { $set: { replyTo: null } }),
    Post.updateMany({ author: req.user._id }, { $unset: { author: 1 } }),
  ]);
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: 'Account deleted' });
};
exports.stats = async (req, res) => {
  const [users, posts, responses, pendingReports, keywords] = await Promise.all([
    User.countDocuments(), Post.countDocuments(), Response.countDocuments(),
    Report.countDocuments({ status: 'pending' }), Keyword.countDocuments(),
  ]);
  res.json({ users, posts, responses, pendingReports, keywords });
};

exports.promoteByEmail = async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role !== 'user') return res.status(400).json({ message: 'Only regular users can be promoted' });
  user.role = 'admin';
  user.adminLabel = await allocateAdminLabel();
  await user.save();
  res.json({ message: `${user.adminLabel} added`, user: user.toObject({ transform: (_doc, value) => { delete value.password; return value; } }) });
};

exports.updateAdminRole = async (req, res) => {
  if (req.body.role !== 'user') return res.status(400).json({ message: 'Admins can only be demoted to users' });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role !== 'admin') return res.status(400).json({ message: 'Only admin accounts can be demoted' });
  user.role = 'user';
  user.adminLabel = undefined;
  await user.save();
  res.json({ message: 'Admin demoted to user' });
};
