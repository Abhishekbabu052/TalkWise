module.exports = (req, res, next) =>
  req.user && req.user.role === 'superadmin'
    ? next()
    : res.status(403).json({ message: 'Superadmin access only' });