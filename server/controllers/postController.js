const Post = require('../models/Post');
const Reaction = require('../models/Reaction');
const Response = require('../models/Response');
const { getIO } = require('../socket/socket');
const ALLOWED = ['👍', '❤️', '😂', '😮', '😢', '😡', '🤡', '😭', '💀', '✅', '❌', '💯'];
const summarize = (reactions = [], identity = {}) => {
  const counts = {};
  reactions.forEach((r) => { counts[r.emoji] = (counts[r.emoji] || 0) + 1; });
  const mine = reactions.filter((r) => identity.user
    ? String(r.user) === String(identity.user)
    : r.clientId === identity.clientId).map((r) => r.emoji);
  return { counts, mine, total: reactions.length };
};
const getIdentity = (req) => req.user ? { user: req.user._id } : { clientId: req.headers['x-client-id'] };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
exports.getPosts = async (req, res) => {
  const q = req.query.search ? { title: new RegExp(esc(req.query.search), 'i') } : {};
  const posts = await Post.find(q).sort('-createdAt').lean();
  const [responseCounts, reactionCounts] = await Promise.all([
    Response.aggregate([{ $group: { _id: '$post', n: { $sum: 1 } } }]),
    Reaction.aggregate([{ $group: { _id: '$post', n: { $sum: 1 } } }]),
  ]);
  const responseMap = Object.fromEntries(responseCounts.map((c) => [String(c._id), c.n]));
  const reactionMap = Object.fromEntries(reactionCounts.map((c) => [String(c._id), c.n]));
  res.json(posts.map((p) => ({ ...p, responseCount: responseMap[String(p._id)] || 0, reactionTotal: reactionMap[String(p._id)] || 0 })));
};
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const reactions = await Reaction.find({ post: post._id }).lean();
    res.json({ ...post.toObject(), reactions: summarize(reactions, getIdentity(req)) });
  } catch { res.status(404).json({ message: 'Post not found' }); }
};
exports.createPost = async (req, res) => {
  const { title, description } = req.body;
  if (typeof description !== 'string' || !description.trim()) return res.status(400).json({ message: 'Description required' });
  const post = await Post.create({ title: typeof title === 'string' ? title.trim() : '', description, author: req.user._id, image: req.file ? `/uploads/${req.file.filename}` : '' });
  res.status(201).json(post);
};
exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (typeof req.body.title === 'string') post.title = req.body.title.trim();
  post.description = req.body.description || post.description;
  if (req.file) post.image = `/uploads/${req.file.filename}`;
  res.json(await post.save());
};
exports.deletePost = async (req, res) => {
  await Response.deleteMany({ post: req.params.id });
  await Reaction.deleteMany({ post: req.params.id });
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Post deleted' });
};

exports.react = async (req, res) => {
  const { emoji } = req.body;
  const identity = getIdentity(req);
  if (!ALLOWED.includes(emoji)) return res.status(400).json({ message: 'Unsupported reaction' });
  if (!identity.user && (!identity.clientId || identity.clientId.length < 8 || identity.clientId.length > 64)) {
    return res.status(400).json({ message: 'Missing client id' });
  }
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const reactionFilter = { post: post._id, ...identity };
  const existing = await Reaction.findOne(reactionFilter);
  if (existing?.emoji === emoji) {
    await existing.deleteOne();
  } else if (existing) {
    existing.emoji = emoji;
    await existing.save();
  } else {
    await Reaction.create({ ...reactionFilter, emoji });
  }
  const reactions = await Reaction.find({ post: post._id }).lean();
  const { counts, total } = summarize(reactions);
  getIO().to(`post:${post._id}`).emit('reactionUpdate', { postId: String(post._id), counts, total });
  res.json(summarize(reactions, identity));
};
