const mongoose = require('mongoose');
module.exports = mongoose.model('Keyword', new mongoose.Schema({
  word: { type: String, required: true, unique: true, lowercase: true, trim: true },
}, { timestamps: true }));
