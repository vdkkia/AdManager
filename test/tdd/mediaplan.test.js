const app = require("../../index");
const request = require("supertest");
const Users = require("../Utility/Users");
const Campaigns = require("../../api/models/Campaign");

describe("Add Media Plan TDD", function() {
  it("Should percentage price grater than or equal to 100", async function() {
    //Create campaign:
    let a = {
      name: "TestCampaignForMeidalPlanTDD",
      brand_id: 1,
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: "5000",
      status: "Draft",
      agency_id: -1,
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    new_campaign.save({});

    const userjwt = Users.makeBrandUser();
    const res = await request(app)
      .post("/v1/mediaplan/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(400)
      .send({
        percentage_price: 99
      });
  });

  it("Should budget and reach be a number", async function() {
    //Create campaign:
    let a = {
      name: "TestCampaignForMeidalPlanTDD",
      brand_id: 1,
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: "5000",
      status: "Draft",
      agency_id: -1,
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    new_campaign.save({});

    const userjwt = Users.makeBrandUser();
    const res = await request(app)
      .post("/v1/mediaplan/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(400)
      .send({
        percentage_price: 105,
        budget: "a",
        reach: 20
      });
  });
});
