"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BlockedSites = new Schema({
  id: {
    type: Schema.ObjectId,
    required: "Site id is required!"
  },
  domain: {
    type: String
  }
});

var MediaPlanSchema = new Schema(
  {
    blocked_sites: [
      {
        type: BlockedSites
      }
    ],
    percentage_price: {
      type: Number,
      required: "Percentage price is required!"
    },
    reach: {
      type: Number
    },
    budget: {
      type: Number
    },
    budget_spent: {
      type: Number
    },
    reach_served: {
      type: Number
    },
    campaign_id: {
      type: Schema.ObjectId,
      required: "Campaign Id is required!"
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("MediaPlan", MediaPlanSchema);
