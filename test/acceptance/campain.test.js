const app = require("../../index");
const request = require("supertest");
const { expect } = require("chai");
const Users = require("../Utility/Users");
const Tools = require("../Utility/Tools");
const Campaigns = require("../../api/models/Campaign");

describe("Campaign Controller", function() {
  describe("create", function() {
    it("Should select any brand, if the user is an agency.", async function() {
      const userjwt = Users.makeAgencyUser();
      const res = await request(app)
        .post("/v1/campaigns/")
        .set("Authorization", `Bearer ${userjwt}`)
        .expect(200)
        .send({
          name: "مولفیکس",
          brand_id: Tools.RandomObjectId(),
          categories: ["IAB1-1", "IAB11"],
          start_time: "2018-05-11T10:34:32.311Z",
          end_time: "2018-07-11T10:33:59.788Z",
          total_reach: "5000",
          landing_page: "www.google.com/resource"
        });
      expect(res.body).to.not.be.undefined;
      expect(res.body.data._id).to.not.be.undefined;
      const _campaign = await Campaigns.findById(res.body.data._id);
      expect(_campaign.agency_id).to.not.be.undefined;
      expect(_campaign.status).to.be.equal("Draft");
    });

    it("Should not change agency, if the user is an agency.(and not admin)", async function() {
      const userjwt = Users.makeOtherAgencyUser();
      const res = await request(app)
        .post("/v1/campaigns/")
        .set("Authorization", `Bearer ${userjwt}`)
        .expect(400)
        .send({
          name: "برترینها",
          brand_id: 1,
          categories: ["IAB1-1", "IAB11"],
          start_time: "2018-07-11T10:34:32.311Z",
          end_time: "2018-07-11T10:33:59.788Z",
          agency_id: 9,
          total_reach: "5000",
          landing_page: "www.google.com/resource"
        });
    });
    it("should set agency to videoboom if brand itself creates campaign.", async function() {
      const userjwt = Users.makeBrandUser();
      const res = await request(app)
        .post("/v1/campaigns/")
        .set("Authorization", `Bearer ${userjwt}`)
        .expect(200)
        .send({
          name: "کارباما",
          brand_id: Tools.RandomObjectId(),
          categories: ["IAB1-1", "IAB11"],
          start_time: "2018-03-11T10:34:32.311Z",
          end_time: "2018-07-11T10:33:59.788Z",
          total_reach: "5000",
          landing_page: "www.google.com/resource"
        });
      expect(res.body).to.not.be.undefined;
      expect(res.body.data._id).to.not.be.undefined;
      const _campaign = await Campaigns.findById(res.body.data._id);
      expect(_campaign.agency_id).to.equal("5b8d22589b905e143e514d69");
    });

    it("should not create campaign for other agencies.", async function() {
      const userjwt = Users.makeOtherAgencyUser();
      const res = await request(app)
        .post("/v1/campaigns/")
        .set("Authorization", `Bearer ${userjwt}`)
        .expect(400)
        .send({
          name: "کافه بازار",
          brand_id: Tools.RandomObjectId(),
          agency_id: Tools.RandomObjectId(),
          categories: ["IAB1-1", "IAB11"],
          start_time: "2018-07-11T10:34:32.311Z",
          end_time: "2018-07-11T10:33:59.788Z",
          total_reach: "5000",
          status: "Draft",
          landing_page: "www.google.com/resource"
        });
    });

    it("should create campaign for any agencies if user is admin.", async function() {
      const userjwt = Users.makeAdminUser();
      const res = await request(app)
        .post("/v1/campaigns/")
        .set("Authorization", `Bearer ${userjwt}`)
        .expect(200)
        .send({
          name: "ویديو بوم",
          brand_id: Tools.RandomObjectId(),
          agency_id: "5b8d22589b905e143e514d69",
          categories: ["IAB1-1", "IAB11"],
          start_time: "2018-06-11T10:34:32.311Z",
          end_time: "2018-07-11T10:33:59.788Z",
          total_reach: "5000",
          landing_page: "www.google.com/resource"
        });
    });

    it("should create campaign for own agency.", async function() {
      const userjwt = Users.makeOtherAgencyUser();
      const res = await request(app)
        .post("/v1/campaigns/")
        .set("Authorization", `Bearer ${userjwt}`)
        .expect(200)
        .send({
          name: "قطر",
          brand_id: Tools.RandomObjectId(),
          agency_id: Tools.RandomObjectId(),
          categories: ["IAB1-1", "IAB11"],
          start_time: "2018-05-11T10:34:32.311Z",
          end_time: "2018-07-11T10:33:59.788Z",
          total_reach: "5000",
          landing_page: "www.google.com/resource"
        });
    });
  });

  it("should return campaings for admin", async function() {
    let a = {
      name: "کاله",
      brand_id: "1",
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: 5000,
      budget: 10000000,
      agency_id: "5",
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    new_campaign.save({});

    const userjwt = Users.makeAdminUser();
    const res = await request(app)
      .get("/v1/campaigns/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200)
      .send();
    expect(res.body.data).to.deep.include(a);
  });

  it("should not get a campaign of other agencies.", async function() {
    let a = {
      name: "کمپین",
      brand_id: "1",
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: "5000",
      budget: 10000000,
      agency_id: "5",
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    new_campaign.save({});

    const userjwt = Users.makeOtherAgencyUser();
    const res = await request(app)
      .get("/v1/campaigns/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(404)
      .send();
  });

  it("should get a campaign of own agency.", async function() {
    let a = {
      name: "کمپین تست",
      brand_id: "1",
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: 5000,
      budget: 10000000,
      agency_id: "2",
      status: "Draft",
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    new_campaign.save({});

    const userjwt = Users.makeOtherAgencyUser();
    const res = await request(app)
      .get("/v1/campaigns/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200)
      .send({});
    expect(res.body.data).to.deep.include(a);
  });

  it("should get list of campaigns if user is Admin", async function() {
    const userjwt = Users.makeAdminUser();

    const res = await request(app)
      .get("/v1/campaigns/0/10/")
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200)
      .send({});
  });

  it("should get only the list of related campaigns if user is Agency", async function() {
    await Campaigns.remove({});

    let a = {
      name: "کی دبلیو سی",
      brand_id: "1",
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: "6000",
      budget: 25000,
      agency_id: "2",
      status: "Draft",
      landing_page: "www.google.com/resource"
    };

    let b = {
      name: "سپهر",
      brand_id: "1",
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: "6000",
      budget: 25000,
      agency_id: "3",
      status: "Draft",
      landing_page: "www.google.com/resource"
    };
    await new Campaigns(a).save({});
    await new Campaigns(b).save({});

    const userjwt = Users.makeOtherAgencyUser();

    const res = await request(app)
      .get("/v1/campaigns/0/100/")
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200)
      .send({});
    expect(Object.keys(res.body.data.list).length).to.be.equal(1);
    expect(res.body.data.list[0].agency_id).to.be.equal("2");
  });

  it("Create a campaign and add some creative to it", async function() {
    let a = {
      name: "اطلس مال",
      brand_id: "1",
      categories: ["IAB1-1", "IAB11"],
      start_time: "2018-07-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      agency_id: "-1",
      total_reach: "5000",
      landing_page: "www.google.com/resource"
    };

    new_campaign = new Campaigns(a);
    new_campaign.save({});
    //Add creative...
    const userjwt = Users.makeBrandUser();
    const cres = await request(app)
      .put("/v1/campaigns/addcreative/" + new_campaign._id)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200)
      .send([
        {
          name: "SampleName1",
          type: 0,
          file_name: "newFileTest1.jpg",
          extension: "png",
          file_size: 856000,
          duration: 20
        },
        {
          name: "SampleName2",
          type: 1,
          file_name: "newFileTest2.mp4",
          extension: "mp4",
          file_size: 3000000,
          duration: 20
        }
      ]);
    const _campaign = await Campaigns.findById(new_campaign._id);
    expect(_campaign.creatives.length).to.equal(2);
  });
});
