const Report = require('../models/Report');
const Notification = require('../models/Notification');
const { getIO } = require('../socket/socket');
exports.create = async (req, res) => {
  const { type, response, reportedUser, reason } = req.body;
  if (!reason) return res.status(400).json({ message: 'Please give a reason' });
  const report = await Report.create({ reporter: req.user._id, type, response, reportedUser, reason });
  const n = await Notification.create({ type: 'report', message: `${req.user.name} reported a ${type}: ${reason}` });
  getIO().to('admins').emit('notification', n);
  res.status(201).json(report);
};
exports.getAll = async (req, res) => {
  res.json(await Report.find().sort('-createdAt')
    .populate('reporter', 'name').populate('reportedUser', 'name isBlocked')
    .populate({ path: 'response', populate: { path: 'user', select: 'name' } }));
};
exports.deleteAll = async (req, res) => {
  const result = await Report.deleteMany({});
  res.json({ message: 'Reports deleted', deletedCount: result.deletedCount });
};
exports.updateStatus = async (req, res) => {
  res.json(await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));
};
