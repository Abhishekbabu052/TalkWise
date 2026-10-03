const r = require('express').Router();
const c = require('../controllers/keywordController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
r.use(protect, admin);
r.get('/', c.getAll); r.post('/', c.add); r.delete('/:id', c.remove);
module.exports = r;
