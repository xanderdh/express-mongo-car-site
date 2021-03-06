const { Router } = require('express');
const isAuthenticated = require('./isAdminLoggedIn');
const path = require('path');
const uuid = require('uuid');
const CarManufacturer = require('../../models/CarManufacturer');
const fs = require('fs');
const _ = require('lodash');

const router = Router();
const PUBLIC_DIR = path.join(__dirname, '../../../', 'public');

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

router.post('/delete-car-manufacture', isAuthenticated, async (req, res) => {
  const _id = req.body.id;
  const itemToRemoveList = await CarManufacturer.find({ _id });
  const itemToRemove = itemToRemoveList[0];

  CarManufacturer.deleteOne({ _id }, err => {
    if (!err) {
      if (itemToRemove) {
        const imageToDelete = path.join(PUBLIC_DIR, itemToRemove.imgUrl);
        fs.unlink(imageToDelete, () => {
          res.redirect('/admin/car-types')
        })
      }
    }
  })
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
  const filePath = path.join(PUBLIC_DIR, 'upload', fileName);

  file.mv(filePath, async err => {
    if (err) {
      return res.status(500).send(err)
    }

    const newManufacturer = new CarManufacturer({
      title: name,
      manufacturer: _.toLower(name),
      imgUrl: `/upload/${fileName}`
    });

    await newManufacturer.save();

    res.redirect('/admin/car-types')
  })
});

module.exports = router;
