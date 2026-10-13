const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: { type: String, default: '', trim: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
schema.index({ createdAt: -1 });
schema.index({ title: 1 });
module.exports = mongoose.model('Post', schema);
