const jwt = require("jsonwebtoken");
var config = require('config');
const secretKey = config.get("secret");
const ErrorResponse = require("../helpers/ErrorResponse");

exports.ValidateUser = function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw new ErrorResponse(401, "No credentials sent!");
    } else {
      var token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          throw new ErrorResponse(401, "Failed to authenticate token.");
        } else {
          req.UserInfo = decoded;
        }
      });
    }
    next();
  } catch (err) {
    err.send(res);
  }

}