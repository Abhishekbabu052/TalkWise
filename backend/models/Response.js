const mongoose = require('mongoose');
module.exports = mongoose.model('Response', new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Response', default: null },
  text: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true }));
