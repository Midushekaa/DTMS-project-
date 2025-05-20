const express = require("express");
const router = express.Router();

const adminAuthRoutes = require("./auth");
const cadreRoutes = require("./cadre");
const accessRoutes = require("./access");
const transferApplcaitions = require("./transferApplcaitions");
const transferProcess = require("./transferProcess");

router.use("/auth/admin", adminAuthRoutes);
router.use("/admin", accessRoutes);
router.use("/admin", transferApplcaitions);
router.use("/admin", transferProcess);
router.use("/admin", cadreRoutes);

module.exports = router;
