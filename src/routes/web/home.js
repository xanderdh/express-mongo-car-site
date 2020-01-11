const { Router } = require('express');

const router = Router();

router.get('/', async (req, res) => {
  console.log(res.locals);
  const { navList } = res.locals.headerData;

  res.render('pages/index', {
    title: 'Home page',
    header: {
      hasBodiesLink: true,
      navList
    }
  });
});

module.exports = router;
