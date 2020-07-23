const Bounce = require("bounce");
const ErrorResponse = require("../helpers/ErrorResponse");
const SuccuessResponse = require("../helpers/SuccessResponse");
const _ = require("lodash");
const MediaPlan = require("../models/MediaPlan");

const Joi = require("../helpers/joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.add_mediapaln = async function(req, res) {
  const schema = {
    blocked_sites: Joi.array().items(
      Joi.object({
        id: Joi.required(),
        domain: Joi.string()
      })
    ),
    percentage_price: Joi.number()
      .greater(99)
      .required(),
    reach: Joi.number(),
    budget_spent: Joi.number(),
    budget: Joi.number(),
    reach_served: Joi.number(),
    campaign_id: Joi.required()
  };
  req.body.campaign_id = req.params.campaignId;
  try {
    const { error, value } = Joi.validate(req.body, schema);
    if (error) {
      throw new ErrorResponse(400, error.details[0].message);
    }
    const newMediaPlan = await MediaPlan.create(value);
    return new SuccuessResponse("MediaPlan created!", newMediaPlan);
  } catch (e) {
    Bounce.rethrow(e, "system");
    return e;
  }
};

exports.get_mediapaln = async function(req) {
  const schema = {
    campaignId: Joi.objectId()
  };
  const { error, value } = Joi.validate(req.params, schema);
  if (error) {
    return new ErrorResponse(400, error.details[0].message);
  }
  let { campaignId } = value;

  try {
    try {
      var _mediaplan = await MediaPlan.findOne({ campaign_id: campaignId });
    } catch (e) {
      throw new ErrorResponse(404, "MediaPlan not found");
    }
    return new SuccuessResponse("MediaPlan was found!", _mediaplan);
  } catch (e) {
    Bounce.rethrow(e, "system");
    return e;
  }
};
