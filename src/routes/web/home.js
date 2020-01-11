const { Router } = require('express');
const Nav = require('../../models/Nav');

const router = Router();

router.get('/', async (req, res) => {
  const dbNavList = await Nav.find({});

  const navList = dbNavList.map(el => {
    const newEl = el;
    newEl.active = false;

    return newEl
  });

  res.render('pages/index', {
    title: 'Home page',
    header: {
      hasBodiesLing: true,
      navList
    }
  });
});

module.exports = router;
