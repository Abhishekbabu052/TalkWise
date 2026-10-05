const Response = require('../models/Response');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { checkText } = require('../services/moderation');
const { getIO } = require('../socket/socket');
const populateResponse = (query) => query
  .populate('user', 'name')
  .populate({ path: 'replyTo', select: 'text createdAt user', populate: { path: 'user', select: 'name' } });

exports.getByPost = async (req, res) => {
  res.json(await populateResponse(Response.find({ post: req.params.postId })).sort('createdAt'));
};
exports.create = async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Response cannot be empty' });
  const found = await checkText(text);
  if (found.length) {
    const n = await Notification.create({
      type: 'moderation', user: req.user._id,
      message: `${req.user.name} tried to post a response containing prohibited words: ${found.join(', ')}`,
    });
    await User.findByIdAndUpdate(req.user._id, { $inc: { warnings: 1 } });
    getIO().to('admins').emit('notification', n);
    return res.status(422).json({ message: 'Your response contains prohibited language and was not published.' });
  }
  let replyTo = null;
  if (req.body.replyTo) {
    if (!mongoose.isValidObjectId(req.body.replyTo)) return res.status(400).json({ message: 'Invalid reply target' });
    const parent = await Response.findOne({ _id: req.body.replyTo, post: req.params.postId });
    if (!parent) return res.status(400).json({ message: 'Reply target not found in this discussion' });
    replyTo = parent._id;
  }
  const created = await Response.create({ post: req.params.postId, user: req.user._id, text, replyTo });
  const r = await populateResponse(Response.findById(created._id));
  getIO().to(`post:${req.params.postId}`).emit('newResponse', r);
  res.status(201).json(r);
};
exports.getAll = async (req, res) => {
  res.json(await Response.find().populate('user', 'name').populate('post', 'title').sort('-createdAt').limit(200));
};
exports.update = async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Response cannot be empty' });
  const response = await Response.findByIdAndUpdate(req.params.id, { text }, { new: true })
    .populate('user', 'name').populate('post', 'title');
  if (!response) return res.status(404).json({ message: 'Not found' });
  getIO().to(`post:${response.post._id}`).emit('responseUpdated', response);
  res.json(response);
};
exports.remove = async (req, res) => {
  const r = await Response.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'superadmin' && String(r.user) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
  await r.deleteOne();
  getIO().to(`post:${r.post}`).emit('responseDeleted', r._id);
  res.json({ message: 'Response deleted' });
};
exports.mine = async (req, res) => {
  res.json(await Response.find({ user: req.user._id }).populate('post', 'title').sort('-createdAt'));
};
