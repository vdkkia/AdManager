const express = require("express");
const router = express.Router();
const Controller = require("../controllers/FileUpload");

//router.route("/:campaignId").post(FileUpload.UploadFile);

router.post("/:campaignId", async (req, res) => {
  const result = await Controller.UploadFile(req, res);
  result.send(res);
});

module.exports = router;
