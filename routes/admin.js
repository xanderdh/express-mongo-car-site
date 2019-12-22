const {Router} = require('express');
const isAuthenticated = require('./isAdminLoggedIn');

const router = Router();

router.get('/admin', isAuthenticated, async (req, res) => {

  res.render('pages/admin/admin')
});

router.get('/admin/login', isAuthenticated, async (req, res) => {
  res.render('pages/admin/admin_login')
});

router.post('/admin/login', isAuthenticated, async (req, res) => {
  console.log(req.body);

  // TODO: tmp condition
  const passIsCorrect = req.body.name === '1' && req.body.password === '1';

  if (passIsCorrect) {
    req.session.role = 'admin';
    res.redirect('/admin')
  } else {
    res.render('pages/admin/admin_login', {
      name: req.body.name
    })
  }
});

module.exports = router;
