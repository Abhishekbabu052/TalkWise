const Notification = require('../models/Notification');
exports.getAll = async (req, res) => res.json(await Notification.find().populate('user', 'name').sort('-createdAt').limit(100));
exports.markRead = async (req, res) => res.json(await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true }));
exports.markAllRead = async (req, res) => { await Notification.updateMany({}, { isRead: true }); res.json({ message: 'ok' }); };
exports.remove = async (req, res) => { await Notification.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
