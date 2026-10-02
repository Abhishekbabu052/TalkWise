const User = require('../models/User');
const Response = require('../models/Response');
const Post = require('../models/Post');
const Report = require('../models/Report');
const Keyword = require('../models/Keyword');
const Reaction = require('../models/Reaction');
exports.getUsers = async (req, res) => res.json(await User.find().select('-password').sort('-createdAt'));
exports.toggleBlock = async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: 'User not found' });
  if (u.role === 'admin') return res.status(400).json({ message: 'Cannot block an admin' });
  u.isBlocked = !u.isBlocked;
  await u.save();
  res.json(u);
};
exports.removeUser = async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: 'User not found' });
  if (u.role === 'admin') return res.status(400).json({ message: 'Cannot remove an admin' });
  await Response.deleteMany({ user: u._id });
  await Reaction.deleteMany({ user: u._id });
  await u.deleteOne();
  res.json({ message: 'User removed' });
};
exports.deleteMe = async (req, res) => {
  if (req.user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) return res.status(400).json({ message: 'The last admin account cannot be deleted' });
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
