const expect = require("chai").expect;
const controller = require("../../api/controllers/Campaign");
const Tools = require("../Utility/Tools");

describe("Add Campaign TDD", function() {
  it("Should Start time be a date", async function() {
    const result = await controller.create({
      start_time: "aaaa"
    });
    expect(result.status).to.equal(400);
  });

  it("Should End time be a date", async function() {
    const result = await controller.create({
      start_time: "2019-07-11T10:33:59.788Z",
      end_time: "3432"
    });
    expect(result.status).to.equal(400);
  });

  it("Should Start time smaller than End time ", async function() {
    const result = await controller.create({
      start_time: "2018-08-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z"
    });
    expect(result.status).to.equal(400);
  });

  it("Should Total_reach be a number ", async function() {
    const result = await controller.create({
      start_time: "2018-08-11T10:34:32.311Z",
      end_time: "2018-09-11T10:33:59.788Z",
      total_reach: "A"
    });
    expect(result.status).to.equal(400);
  });

  it("Should Daily_budget be a number ", async function() {
    const result = await controller.create({
      start_time: "2018-08-11T10:34:32.311Z",
      end_time: "2018-09-11T10:33:59.788Z",
      total_reach: "25000",
      daily_budget: "a"
    });
    expect(result.status).to.equal(400);
  });

  it("Should budget be a number ", async function() {
    const result = await controller.create({
      start_time: "2018-08-11T10:34:32.311Z",
      end_time: "2018-09-11T10:33:59.788Z",
      total_reach: "25000",
      daily_budget: "1000",
      budget: "a"
    });
    expect(result.status).to.equal(400);
  });

  it("Should minimum budget not be less than the value is set in config.", async function() {
    const result = await controller.create({
      start_time: "2018-05-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: "5000",
      budget: 20000
    });
    expect(result.status).to.equal(400);
  });

  it("Should brand_id be a number.", async function() {
    const result = await controller.create({
      name: "new campaign",
      brand_id: "ss",
      start_time: "2018-05-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: "5000",
      budget: 2000000
    });
    expect(result.status).to.equal(400);
  });

  it("Should update a campaign.", async function() {
    let campaign = {
      name: "قطر آنلاین",
      brand_id: Tools.RandomObjectId(),
      start_time: "2018-05-11T10:34:32.311Z",
      end_time: "2018-07-11T10:33:59.788Z",
      total_reach: "5000",
      landing_page: "www.test.com",
      budget: 2000000
    };
    const result = await controller.create(campaign);

    campaign.name = "updated campaign";
    campaign.status = "Rejected";
    console.log(result);
    console.log(campaign.brand_id);

    // var Body = { body: campaign, params: { campaignId: result.data._id } };
    // const updated = await controller.update(Body.body, Body.params);
    // expect(updated.data.status).to.equal("Rejected");
  });
});
