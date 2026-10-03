const r = require('express').Router();
const c = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
r.post('/', protect, c.create);
r.get('/', protect, admin, c.getAll);
r.delete('/', protect, admin, c.deleteAll);
r.put('/:id', protect, admin, c.updateStatus);
module.exports = r;
