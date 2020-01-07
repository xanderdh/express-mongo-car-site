const {Router} = require('express');
const isAuthenticated = require('./isAdminLoggedIn');
const path = require('path');
const uuid = require('uuid');
const CarManufacturer = require('../../models/CarManufacturer');

const router = Router();

const isImageMimetype = (mimetype) => {
  return mimetype === 'image/jpeg' || mimetype === 'image/png'
};

const genFileName = (fileType) => {
  return `${uuid()}.${fileType.split('/')[1]}`
};

const getEditCarPageData = async () => {
  const manufacturerList = await CarManufacturer.find({});

  return {
    isCarTypesPage: true,
    manufacturerList: manufacturerList
  }
};

router.get('/', isAuthenticated, async (req, res) => {
  res.render('pages/admin/car_type', {
      ...await getEditCarPageData()
    }
  )
});

router.post('/add-car-manufacture', isAuthenticated, async (req, res) => {
  const name = req.body.name;

  if (!name) {
    return res.render('pages/admin/car_type', {
      ...await getEditCarPageData(),
      isNoName: true,
    })
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.render('pages/admin/car_type', {
      ...await getEditCarPageData(),
      isNoFile: true,
      name,
    })
  }

  const file = req.files.manufactureLogo;
  const fileType = file.mimetype;

  if (!isImageMimetype(fileType)) {
    return res.render('pages/admin/car_type', {
      ...await getEditCarPageData(),
      inNotImage: true,
      name,
    })
  }

  const fileName = genFileName(fileType);
  const filePath = path.join(__dirname, '../../../', 'public', 'upload', fileName);

  file.mv(filePath, async err => {
    if (err) {
      return res.status(500).send(err)
    }

    const newManufacturer = new CarManufacturer({
      title: name,
      manufacturer: name,
      imgUrl: `/upload/${fileName}`
    });

    await newManufacturer.save();

    res.redirect('/admin/car-types')
  })
});

module.exports = router;
