const { Router } = require("express");
const homeRoutes = require("./web/home");
const adminRoutes = require("./admin/admin");
const withHeaderData = require("./middlware/withHeaderData");

const router = new Router();

router.use('/admin', adminRoutes);

router.use(withHeaderData);
router.use(homeRoutes);

module.exports = router;
