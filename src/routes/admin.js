const {Router} = require('express');
const isAuthenticated = require('../routes/isAdminLoggedIn');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

const router = Router();

const incorrectPassword = (req, res) => {
  res.render('pages/admin/admin_login', {
    name: req.body.name,
    isError: true
  })
};

router.get('/admin', isAuthenticated, async (req, res) => {
  res.render('pages/admin/admin')
});

router.get('/admin/login', isAuthenticated, async (req, res) => {
  res.render('pages/admin/admin_login')
});

router.post('/admin/login', isAuthenticated, async (req, res) => {

  // Add admin to DB

  // const name = 'admin'
  // const password = 'admin'
  // const saltRounds = 10;
  // bcrypt.hash(password, saltRounds, async (err, hash) => {
  //   console.log(hash)
  //
  //   const admin = new Admin({
  //     name,
  //     password: hash
  //   });
  //
  //   // await admin.save()
  // });

  const adminUser = await Admin.find({name: req.body.name});

  if (adminUser.length) {
    bcrypt.compare(req.body.password, adminUser[0].password, (err, passwordStatus) => {
      if (passwordStatus) {
        req.session.role = 'admin';
        res.redirect('/admin')
      } else {
        incorrectPassword(req, res)
      }
    });
  } else {
    incorrectPassword(req, res)
  }
});

router.get('/admin/logout', async (req, res) => {
  req.session.role = 'user';
  res.redirect('/')
});

module.exports = router;
