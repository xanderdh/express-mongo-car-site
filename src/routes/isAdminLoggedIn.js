module.exports = function isAuthenticated(req, res, next) {
  const role = req.session && req.session.role;

  if (role === 'admin') {
    return next();
  }

  if (req.url === '/login') {
    return next();
  } else {
    res.redirect('/admin/login');
  }
};
