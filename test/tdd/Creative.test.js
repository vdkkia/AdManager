const app = require("../../index");
const request = require("supertest");
const Users = require("../Utility/Users");
const Campaigns = require("../../api/models/Campaign");

describe("[Add Creative TDD]", function() {
  it("Should Type be a number (image or video)", async function() {
    let a = {
      name: "مای بیبی",
      brand_id: 1,
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      agency_id: -1,
      total_reach: "5000",
      status: "Draft",
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    new_campaign.save({});

    const userjwt = Users.makeAdminUser();
    const res = await request(app)
      .put("/v1/campaigns/addcreative/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(400)
      .send([
        {
          name: "TestCreative",
          Type: "f",
          FileName: "test.jpg",
          FileSize: 15260,
          Extention: "jpg",
          Duration: 35
        }
      ]);
  });

  it("Should FileSize be a number (image or video)", async function() {
    let a = {
      name: "سپهر سیر",
      brand_id: 1,
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      agency_id: -1,
      total_reach: "5000",
      status: "Draft",
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    new_campaign.save({});

    const userjwt = Users.makeAdminUser();
    const res = await request(app)
      .put("/v1/campaigns/addcreative/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(400)
      .send([
        {
          name: "TestCreative",
          Type: 0,
          FileName: "test.jpg",
          FileSize: "f",
          Extention: "jpg",
          Duration: 35
        }
      ]);
  });

  it("Should Duration be a number (image or video)", async function() {
    let a = {
      name: "ایران خودرو",
      brand_id: 1,
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      agency_id: -1,
      total_reach: "5000",
      status: "Draft",
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    new_campaign.save({});

    const userjwt = Users.makeAdminUser();
    const res = await request(app)
      .put("/v1/campaigns/addcreative/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(400)
      .send([
        {
          name: "TestCreative",
          Type: 0,
          FileName: "test.jpg",
          FileSize: 12560,
          Extention: "jpg",
          Duration: "fff"
        }
      ]);
  });
});
