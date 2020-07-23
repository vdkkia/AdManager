const express = require("express");
const router = express.Router();
var Controller = require("../controllers/MediaPlan");

router.post("/:campaignId", async (req, res) => {
  const result = await Controller.add_mediapaln(req, res);
  result.send(res);
});

router.get("/:campaignId", async (req, res) => {
  const result = await Controller.get_mediapaln(req);
  result.send(res);
});

module.exports = router;
