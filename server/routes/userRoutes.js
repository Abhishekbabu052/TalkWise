const r = require('express').Router();
const c = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
r.delete('/me', protect, c.deleteMe);
r.use(protect, admin);
r.get('/stats', c.stats); r.get('/', c.getUsers);
r.put('/:id/block', c.toggleBlock); r.delete('/:id', c.removeUser);
module.exports = r;
