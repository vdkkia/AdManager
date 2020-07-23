const Bounce = require("bounce");
const ErrorResponse = require("../helpers/ErrorResponse");
const SuccuessResponse = require("../helpers/SuccessResponse");
const _ = require("lodash");
const Brands = require("../models/Brands");
const Joi = require("../helpers/joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.create_a_brand = async function(req) {
  const schema = {
    name: Joi.string().required(),
    en_name: Joi.string(),
    domain: Joi.string()
  };
  const { error, value } = Joi.validate(req.body, schema);
  if (error) {
    throw new ErrorResponse(400, error.details[0].message);
  }
  let Role = req.UserInfo.role;
  try {
    if (Role === "admin") {
      var new_brand = new Brands(value);
      const data = await new_brand.save();
      return new SuccuessResponse("Brand created!", data);
    } else {
      throw new ErrorResponse(403, "Access is denied!");
    }
  } catch (e) {
    Bounce.rethrow(e, "system");
    return e;
  }
};

exports.read_a_brand = async function(req) {
  const schema = {
    brandId: Joi.objectId()
  };
  const { error, value } = Joi.validate(req.params, schema);
  if (error) {
    return new ErrorResponse(400, error.details[0].message);
  }
  let { brandId } = value;

  let Role = req.UserInfo.role;
  try {
    if (Role === "admin") {
      try {
        const brand = await Brands.findById(brandId);
        return new SuccuessResponse("Brand was found!", brand);
      } catch (e) {
        throw new ErrorResponse(404, "Cannot find brand!");
      }
    } else throw new ErrorResponse(403, "Access is denied!");
  } catch (e) {
    Bounce.rethrow(e, "system");
    return e;
  }
};

exports.delete_a_brand = async function(req, params) {
  let Role = req.UserInfo.role;
  try {
    if (Role === "admin") {
      console.log(params.brandId);
      Brands.remove(
        {
          _id: params.brandId
        },
        function() {}
      );
      return new SuccuessResponse("Barand successfully deleted");
    } else {
      throw new ErrorResponse(403, "Access is denied!");
    }
  } catch (e) {
    Bounce.rethrow(e, "system");
    return e;
  }
};
exports.update_a_brand = async function(req, params) {
  const schema = {
    name: Joi.string(),
    en_name: Joi.string(),
    domain: Joi.string()
  };
  const { error, value } = Joi.validate(req.body, schema);
  if (error) {
    throw new ErrorResponse(400, error.details[0].message);
  }

  let Role = req.UserInfo.role;
  try {
    if (Role === "admin") {
      const updatedBrand = await Brands.findOneAndUpdate(
        { _id: params.brandId },
        value,
        { new: true }
      );

      return new SuccuessResponse("Brand updated!", updatedBrand);
    } else {
      throw new ErrorResponse(403, "Access is denied!");
    }
  } catch (e) {
    Bounce.rethrow(e, "system");
    return e;
  }
};

exports.list_all_brands = async function(params, user) {
  let { role } = user;
  let count;
  try {
    const schema = {
      page: Joi.number().default(0),
      limit: Joi.number().default(10),
      sort: Joi.string().default("name")
    };
    const { error, value } = Joi.validate(params, schema);
    if (error) {
      throw new ErrorResponse(400, error.details[0].message);
    }
    const { page, limit, sort } = value;
    if (role === "admin") {
      try {
        await Brands.find((err, result) => {
          count = result.length;
        });
        const brands = await Brands.find({})
          .limit(limit)
          .sort(sort)
          .skip(page * limit);
        return new SuccuessResponse("Brands were found!", {
          list: brands,
          total: count
        });
      } catch (e) {
        console.log(e);
        throw new ErrorResponse(500, "Error finding brands");
      }
    } else throw new ErrorResponse(403, "Access is denied!");
  } catch (e) {
    Bounce.rethrow(e, "system");
    return e;
  }
};
