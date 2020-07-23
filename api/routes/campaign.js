const express = require("express");
const router = express.Router();
var Controller = require('../controllers/Campaign');

router.post("/", async (req, res) => {
        const result = await Controller.create(req.body);
        result.send(res);
});
router.get('/:page/:limit/:sort?', async (req, res) => {
        const result = await Controller.findAll(req.params, req.UserInfo);
        result.send(res);
});

router.route('/:campaignId')
        .get(async (req, res) => {
                const result = await Controller.find(req.params, req.UserInfo)
                result.send(res);
        })
        .put(async (req, res) => {
                const result = await Controller.update(req.body, req.params);
                result.send(res);
        })
        .delete(Controller.destroy);

router.put('/addcreative/:campaignId', Controller.add_creative);


module.exports = router;