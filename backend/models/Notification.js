const mongoose = require('mongoose');
module.exports = mongoose.model('Notification', new mongoose.Schema({
  type: { type: String, enum: ['moderation', 'report', 'user'], default: 'moderation' },
  message: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true }));
