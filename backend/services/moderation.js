const Keyword = require('../models/Keyword');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Returns the prohibited words found in text (whole-word, case-insensitive)
exports.checkText = async (text) => {
  const list = await Keyword.find();
  return list.map((k) => k.word).filter((w) => new RegExp(`(^|\\W)${esc(w)}(\\W|$)`, 'i').test(text));
};
