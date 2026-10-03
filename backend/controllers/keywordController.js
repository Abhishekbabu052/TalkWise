const Keyword = require('../models/Keyword');
exports.getAll = async (req, res) => res.json(await Keyword.find().sort('word'));
exports.add = async (req, res) => {
  try {
    const word = (req.body.word || '').trim();
    if (!word) return res.status(400).json({ message: 'Keyword required' });
    res.status(201).json(await Keyword.create({ word }));
  } catch { res.status(400).json({ message: 'Keyword already exists' }); }
};
exports.remove = async (req, res) => { await Keyword.findByIdAndDelete(req.params.id); res.json({ message: 'Removed' }); };
