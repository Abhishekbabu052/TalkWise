const mongoose = require('mongoose');
module.exports = mongoose.model('Post', new mongoose.Schema({
  title: { type: String, default: '', trim: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }));
