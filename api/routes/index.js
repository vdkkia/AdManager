const express = require("express");
const campaingRoutes = require("./campaign");
const brandsRoutes = require("./brand");
const mediaPlansRoutes = require("./mediaplan");
const uploadFileRoutes = require("./uploadFile");
const router = express.Router();

router.use("/v1/campaigns/uploadcreative", uploadFileRoutes);
router.use("/v1/campaigns", campaingRoutes);
router.use("/v1/mediaplan", mediaPlansRoutes);
router.use("/v1/brands", brandsRoutes);

module.exports = router;
