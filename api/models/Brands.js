"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BrandsSchema = new Schema(
  {
    name: {
      type: String,
      required: "Please enter the name of the brand"
    },
    en_name: {
      type: String
    },
    domain: {
      type: String
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Brands", BrandsSchema);
