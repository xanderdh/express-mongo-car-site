const { Router } = require('express');

const router = Router();

router.get('/', async (req, res) => {
  const { navList, carManufacturerList } = res.locals.headerData;

  res.render('pages/index', {
    title: 'Home page',
    header: {
      hasBodiesLink: true,
      navList,
      carManufacturerList
    }
  });
});

module.exports = router;
