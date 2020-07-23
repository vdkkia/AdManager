const express = require("express");
const router = express.Router();
var Controller = require("../controllers/Brands");

router.post("/", async (req, res) => {
  const result = await Controller.create_a_brand(req);
  result.send(res);
});

router
  .route("/:brandId")
  .get(async (req, res) => {
    const result = await Controller.read_a_brand(req);
    result.send(res);
  })
  .put(async (req, res) => {
    const result = await Controller.update_a_brand(req, req.params);
    result.send(res);
  })
  .delete(async (req, res) => {
    const result = await Controller.delete_a_brand(req,req.params);
    result.send(res);
  });

router.get("/:page/:limit/:sort?", async (req, res) => {
  const result = await Controller.list_all_brands(req.params, req.UserInfo);
  result.send(res);
});

module.exports = router;
