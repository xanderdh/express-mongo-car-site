const NodeCache = require('node-cache');
const CarManufacturer = require('../../models/CarManufacturer');
const Nav = require('../../models/Nav');

const headerDataCache = new NodeCache();

const SECONDS_IN_HOUR = 86400;

module.exports = async (req, res, next) => {
  let headerData = headerDataCache.get('headerData');

  if (headerData === undefined) {
    const dbNavList = await Nav.find({});
    const carManufacturerList = await CarManufacturer.find({}).limit(33);

    const navList = dbNavList.map(el => {
      const newEl = el;
      newEl.active = false;

      return newEl
    });

    headerData = { navList, carManufacturerList };

    headerDataCache.set('headerData', headerData, SECONDS_IN_HOUR);
  }

  res.locals.headerData = headerData;
  return next()
};
