const { Router } = require("express");
const homeRoutes = require("./web/home");
const adminRoutes = require("./admin/admin");

const router = new Router();

router.use(homeRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
