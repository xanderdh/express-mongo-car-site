const {Router} = require('express');
const isAuthenticated = require('./isAdminLoggedIn');
const bcrypt = require('bcrypt');
const Admin = require('../../models/Admin');
const carTypes = require('./carTypes');

const router = Router();
const saltRounds = 10;

const incorrectPassword = (req, res) => {
  res.render('pages/admin/admin_login', {
    name: req.body.name,
    isError: true
  })
};

router.use('/car-types', carTypes);

router.get('/', isAuthenticated, async (req, res) => {
  const adminList = await Admin.find({});

  res.render('pages/admin/admin', {
    isHomePage: true,
    adminUser: req.session.adminName,
    adminList
  })
});

router.get('/login', isAuthenticated, async (req, res) => {
  res.render('pages/admin/admin_login')
});

router.get('/logout', async (req, res) => {
  req.session.role = 'user';
  res.redirect('/')
});

router.post('/login', isAuthenticated, async (req, res) => {
  const adminUser = await Admin.find({name: req.body.name});

  if (adminUser.length) {
    bcrypt.compare(req.body.password, adminUser[0].password, (err, passwordStatus) => {
      if (passwordStatus) {
        req.session.role = 'admin';
        req.session.adminName = adminUser[0].name;
        res.redirect('/admin')
      } else {
        incorrectPassword(req, res)
      }
    });
  } else {
    incorrectPassword(req, res)
  }
});

router.post('/add-new-admin', isAuthenticated, async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  const exitAdmin = await Admin.find({name});

  if (!exitAdmin.length) {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      const admin = new Admin({
        name,
        password: hash
      });

      await admin.save();
      res.redirect('/admin');
    });
  } else {
    res.redirect('/admin');
  }
});

module.exports = router;
