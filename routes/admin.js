const {Router} = require('express');
const isAuthenticated = require('./isAdminLoggedIn');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

const router = Router();

router.get('/admin', isAuthenticated, async (req, res) => {

  res.render('pages/admin/admin')
});

router.get('/admin/login', isAuthenticated, async (req, res) => {
  res.render('pages/admin/admin_login')
});

router.post('/admin/login', isAuthenticated, async (req, res) => {
  console.log(req.body);

  // const saltRounds = 10;
  // bcrypt.hash("admin", saltRounds, async (err, hash) => {
  //   console.log(hash)
  //
  //   const admin = new Admin({
  //     name: "admin",
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
      }
    });
  } else {
    res.render('pages/admin/admin_login', {
      name: req.body.name
    })
  }

});

module.exports = router;
