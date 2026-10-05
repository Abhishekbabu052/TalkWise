const r = require('express').Router();
const c = require('../controllers/keywordController');
const { protect } = require('../middleware/auth');
const superAdmin = require('../middleware/superAdmin');
r.use(protect, superAdmin);
r.get('/', c.getAll); r.post('/', c.add); r.delete('/:id', c.remove);
module.exports = r;
