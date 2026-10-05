module.exports = (req, res, next) =>
  req.user && ['admin', 'superadmin'].includes(req.user.role)
    ? next()
    : res.status(403).json({ message: 'Admin access only' });
