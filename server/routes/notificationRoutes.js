const r = require('express').Router();
const c = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
r.use(protect, admin);
r.get('/', c.getAll); r.put('/read-all', c.markAllRead); r.put('/:id/read', c.markRead); r.delete('/:id', c.remove);
module.exports = r;
