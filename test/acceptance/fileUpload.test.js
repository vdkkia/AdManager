const app = require("../../index");
const request = require("supertest");
const mongoose = require("mongoose");
const { expect } = require("chai");
const Users = require("../Utility/Users");
supertest = require("supertest");

describe("Uploading a file...", function() {
  it("Should upload a file successfully.", async function() {
    const id = mongoose.Types.ObjectId();
    const userjwt = Users.makeAdminUser();
    const res = await request(app)
      .post("/v1/campaigns/uploadcreative/" + id)
      .set("Authorization", `Bearer ${userjwt}`)
      .attach("image", "public/TestImage.jpg");
    console.log(res.body);
    expect(res.body).to.not.be.undefined;
  });
});
