"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CreativeSchema = new Schema({
  name: {
    type: String,
    required: "Type is required"
  },
  type: {
    // 0 is video , 1 is banner
    type: Number,
    required: "Type is required"
  },
  file_name: {
    type: String,
    require: "File name is required"
  },
  file_size: {
    type: Number
  },
  extension: {
    type: String
  },
  duration: {
    type: Number
  },
  landing_page: {
    type: String
  },
  click_message: {
    type: String,
    required: "Type is required"
  },
  box_message: {
    type: String,
    required: "Type is required"
  }
});

var CampaignsSchema = new Schema(
  {
    name: {
      type: String,
      required: "Please enter the name of the campaign"
    },
    brand_id: {
      type: String
    },
    agency_id: {
      type: String
    },
    categories: [
      {
        type: String,
        required: "At least one category is required!"
      }
    ],

    start_time: {
      type: Date,
      default: Date.now,
      required: "Campaign start time is required!"
    },
    end_time: {
      type: Date,
      default: Date.now() + 1,
      required: "Campaign end time is required!"
    },
    total_reach: {
      type: Number
    },
    budget: {
      type: Number
    },
    daily_budget: {
      type: Number
    },
    status: {
      type: String,
      enum: ["Draft", "Pending", "Approved", "Rejected"],
      default: "Draft",
      required: "Reach is required!"
    },
    creatives: [
      {
        type: CreativeSchema
      }
    ],
    landing_page: {
      type: String,
      required: "Landing page is required!"
    },
    active: {
      type: Boolean,
      default: false
    },
    creation_time: {
      type: Date,
      default: () => Date.now()
    },
    campaign_goal: {
      type: String
    },
    slogan: {
      type: String
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Campaigns", CampaignsSchema);
