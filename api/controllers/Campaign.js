const config = require("config");
const Bounce = require("bounce");
const ErrorResponse = require("../helpers/ErrorResponse");
const SuccuessResponse = require("../helpers/SuccessResponse");
const _ = require("lodash");
const Campaigns = require("../models/Campaign");
const MediaPlan = require("../models/MediaPlan");
const Joi = require("../helpers/joi");
Joi.objectId = require("joi-objectid")(Joi);

async function create(body) {
  const minBudget = config.get("min_budget");
  const schema = {
    start_time: Joi.date().required(),
    end_time: Joi.date()
      .greater(Joi.ref("start_time"))
      .required(),
    total_reach: Joi.number(),
    daily_budget: Joi.number().less(Joi.ref("budget")),
    name: Joi.string().required(),
    brand_id: Joi.objectId(),
    budget: Joi.number().greater(minBudget),
    agency_id: Joi.objectId(),
    categories: Joi.array()
      .items(Joi.string())
      .required(),
    audience: Joi.string(),
    landing_page: Joi.string().required(),
    campaign_goal: Joi.string(),
    slogan: Joi.string()
  };

  try {
    const { error, value } = Joi.validate(body, schema);
    if (error) {
      throw new ErrorResponse(400, error.details[0].message);
    }
    value.agency_id = value.agency_id || "5b8d22589b905e143e514d69";
    const newCampaign = await Campaigns.create(value);
    await MediaPlan.create({
      percentage_price: 100,
      campaign_id: newCampaign._id
    });
    return new SuccuessResponse("Campaign created!", newCampaign);
  } catch (err) {
    Bounce.rethrow(err, "system");
    return err;
  }
}

async function findAll(params, user) {
  let count;
  const schema = {
    page: Joi.number().default(0),
    limit: Joi.number().default(10),
    sort: Joi.string().default("name")
  };
  const { error, value } = Joi.validate(params, schema);
  if (error) {
    return new ErrorResponse(400, error.details[0].message);
  }

  let { brands, agencies, role } = user;
  agencies = agencies.map(x => x.id);
  brands = brands.map(x => x.id);

  try {
    const { page, limit, sort } = value;
    const where =
      role === "admin"
        ? {}
        : {
            $or: [
              {
                agency_id: {
                  $in: agencies
                }
              },
              {
                brand_id: {
                  $in: brands
                }
              }
            ]
          };

    await Campaigns.find((err, result) => {
      count = result.length;
    });
    let _campaigns = await Campaigns.find(where)
      .limit(limit)
      .sort(sort)
      .skip(page * limit);

    return new SuccuessResponse("Campaign(s) was found!", {
      list: _campaigns,
      total: count
    });
  } catch (e) {
    Bounce.rethrow(e, "system");
    return e;
  }
}

const find = async function(params, UserInfo) {
  const schema = {
    campaignId: Joi.objectId()
  };
  const { error, value } = Joi.validate(params, schema);
  if (error) {
    return new ErrorResponse(400, error.details[0].message);
  }
  let { campaignId } = value;

  let { role, brands, agencies } = UserInfo;
  agencies = agencies.map(x => x.id);
  brands = brands.map(x => x.id);
  try {
    let where;
    if (role === "admin") {
      where = { _id: campaignId };
    } else {
      where = {
        $and: [
          {
            _id: campaignId
          },
          {
            $or: [
              {
                agency_id: {
                  $in: agencies
                }
              },
              {
                brand_id: {
                  $in: brands
                }
              }
            ]
          }
        ]
      };
    }

    var _campaigns = await Campaigns.findOne(where);
    if (_campaigns == null) {
      return new ErrorResponse(404, "Campaign Not Found");
    } else {
      return new SuccuessResponse("Campaign Found", _campaigns);
    }
  } catch (e) {
    Bounce.rethrow(e, "system");
    return e;
  }
};
async function update(body, params) {
  const minBudget = config.get("min_budget");
  const schema = {
    start_time: Joi.date(),
    end_time: Joi.date().greater(Joi.ref("start_time")),
    total_reach: Joi.number(),
    daily_budget: Joi.number().less(Joi.ref("budget")),
    name: Joi.string(),
    brand_id: Joi.objectId(),
    budget: Joi.number().greater(minBudget),
    agency_id: Joi.objectId(),
    categories: Joi.array().items(Joi.string()),
    audience: Joi.string(),
    landing_page: Joi.string(),
    campaign_goal: Joi.string(),
    slogan: Joi.string(),
    status: Joi.string()
  };

  const { error, value } = Joi.validate(body, schema);
  if (error) {
    return new ErrorResponse(400, error.details[0].message);
  }
  value.agency_id = value.agency_id || -1;
  try {
    const updatedCampaign = await Campaigns.findOneAndUpdate(
      { _id: params.campaignId },
      value,
      { new: true }
    );
    return new SuccuessResponse("Campaign updated!", updatedCampaign);
  } catch (err) {
    Bounce.rethrow(err, "system");
    return new ErrorResponse(500, "Can not find");
  }
}

const destroy = async function(req, res) {
  Campaigns.remove(
    {
      _id: req.params.campaignId
    },
    function(err, campaign) {
      if (err) res.send(err);
      res.json({
        message: "Campaign successfully deleted"
      });
    }
  );
};

const add_creative = async function(req, res) {
  async function UpdateCampaign(req, creative, res) {
    try {
      var u = await Campaigns.findOneAndUpdate(
        {
          _id: req.params.campaignId
        },
        {
          $push: {
            creatives: creative
          }
        },
        {
          new: true
        }
      );
    } catch (e) {
      throw new ErrorResponse(500, "Cannot create!");
    }

    return new SuccuessResponse("Campaign was updated!", u.creatives);
  }

  const creative = _.map(req.body, function(currentObject) {
    return _.pick(
      currentObject,
      "name",
      "type",
      "file_name",
      "file_size",
      "extension",
      "duration",
      "landing_page",
      "click_message",
      "box_message"
    );
  });
  try {
    var result = creative.map(e => e.type);
    for (var k in result) {
      if (isNaN(result[k]))
        throw new ErrorResponse(400, "Type is not a number!");
    }
    // var result = creative.map(e => e.file_size);
    // for (var k in result) {
    //   if (isNaN(result[k]))
    //     throw new ErrorResponse(400, "FileSize is not a number!");
    // }

    // var result = creative.map(e => e.duration);
    // for (var k in result) {
    //   if (isNaN(result[k]))
    //     throw new ErrorResponse(400, "Duration is not a number!");
    // }

    const success = await UpdateCampaign(req, creative, res);
    success.send(res);
  } catch (err) {
    err.send(res);
  }
};
module.exports = {
  create,
  find,
  findAll,
  update,
  destroy,
  add_creative
};
