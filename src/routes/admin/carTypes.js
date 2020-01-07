const {Router} = require('express');
const isAuthenticated = require('./isAdminLoggedIn');
const path = require('path');
const uuid = require('uuid');

const router = Router();

const isImageMimetype = (mimetype) => {
  return mimetype === 'image/jpeg' || mimetype === 'image/png'
};

const genFileName = (fileType) => {
  return `${uuid()}.${fileType.split('/')[1]}`
};

router.get('/', isAuthenticated, async (req, res) => {
  res.render('pages/admin/car_type', {isCarTypesPage: true})
});

router.post('/add-car-manufacture', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('No files were uploaded.');
    return;
  }

  const file = req.files.manufactureLogo;
  const fileType = file.mimetype;

  if (!isImageMimetype(fileType)) {
    console.log('File is not image');
    return;
  }

  const fileName = genFileName(fileType);
  const filePath = path.join(__dirname, '../../../', 'public', 'upload', fileName);

  file.mv(filePath, err => {
    if (err) {
      return res.status(500).send(err)
    }

    res.redirect('/admin/car-types')
  })
});

module.exports = router;
