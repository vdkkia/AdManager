//This service will be called periodically (every 12 hrs e.g.)

const ReportingService = require('../../mock/ReportingService');
var mongoose = require('mongoose'),
    Campaigns = mongoose.model('Campaigns');
require('../models/Campaign');
const ErrorResponse = require("../helpers/ErrorResponse");
const SuccuessResponse = require("../helpers/SuccessResponse");

exports.CheckCampaign = async (req, res) => {
    try {
        var CampaignId = req.params.campaignId;
        const SpentBudget = await ReportingService.ReportBudget(CampaignId);
        const d = await Campaigns.findById(CampaignId).catch(
            function (err) {
                throw new ErrorResponse(500, "There is no campaign with given id");
            }
        );
        if (!d.budget)
            d.budget = 0;
        var NewBudget = parseInt(d.budget) - SpentBudget;
        const success = await UpdateCampaign(req, NewBudget);
        success.send(res);
    } catch (err) {
        err.send(res);
    }
};
async function UpdateCampaign(req, NewBudget) {
    try {
        await Campaigns.findOneAndUpdate({
            _id: req.params.campaignId
        }, {
            budget: NewBudget.toString()
        }, {
            new: true
        });
    } catch (err) {
        throw new ErrorResponse(500, "Cannot update");
    }
    return new SuccuessResponse("Campaign updated!", "new budget " + NewBudget);

}