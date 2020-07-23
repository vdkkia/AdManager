const ObjectID = require("mongodb").ObjectID;
exports.RandomObjectId = function() {
  return new ObjectID();
};
