const expect = require("chai").expect;
const app = require("../../index");
const request = require("supertest");
const Users = require("../Utility/Users");
const Campaigns = require("../../api/models/Campaign");
const MediaPlan = require("../../api/models/MediaPlan");

describe("[MediaPlan Creator]", function() {
  it("should add a media plan", async function() {
    let a = {
      name: "اطلس مال",
      brand_id: 1,
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: "5000",
      agency_id: -1,
      status: "Draft",
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    await new_campaign.save({});

    const userjwt = Users.makeBrandUser();

    const res = await request(app)
      .post("/v1/mediaplan/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200)
      .send({
        blocked_sites: [
          { id: "5b9ca2a24a3cca00130646c4", domain: "machines.ir" }
        ],
        percentage_price: "100"
      });
    expect(res.body).to.not.be.undefined;
    expect(res.body.data._id).to.not.be.undefined;
  });

  //[admin or own agency/brand] is not implemented
  it("should get media plan", async function() {
    let a = {
      name: "TestCampaignForMeidalPlanTest",
      brand_id: 1,
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: "5000",
      agency_id: -1, //videoboom
      status: "Draft",
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    new_campaign.save({});
    let _mediaplan = {
      blocked_sites: [
        { id: "5b9ca2a24a3cca00130646c4", domain: "www.farsnews.com" },
        { id: "5b9ca2a24a3cca00130646a4", domain: "www.ccc.ir" }
      ],
      percentage_price: 100,
      campaign_id: new_campaign._id
    };

    var new_mediaplan = new MediaPlan(_mediaplan);
    await new_mediaplan.save({});
    const userjwt = Users.makeAgencyUser();

    const res = await request(app)
      .get("/v1/mediaplan/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200);
    expect(res.body).to.not.be.undefined;
    expect(res.body.data._id).to.not.be.undefined;
  });
});
