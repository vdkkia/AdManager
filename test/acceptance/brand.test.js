const app = require("../../index");
const request = require("supertest");
const { expect } = require("chai");
const Users = require("../Utility/Users");
const Brands = require("../../api/models/Brands");

describe("[brand test]", function() {
  it("should create a brand successfully.", async function() {
    const userjwt = Users.makeAdminUser();
    const res = await request(app)
      .post("/v1/brands/")
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200)
      .send({
        name: "سامسونگ",
        en_name: "Samsung",
        domain: "www.samsung.com"
      });
    expect(res.body).to.not.be.undefined;
    expect(res.body.data._id).to.not.be.undefined;
  });

  it("should get a brand successfully.", async function() {
    let brand = {
      name: "برند تست",
      en_name: "TEST_BRAND",
      domain: "www.TESTBRAND.com"
    };

    new_brand = new Brands(brand);
    await new_brand.save({});

    const userjwt = Users.makeAdminUser();
    let page = 0,
      limit = 10;
    const res = await request(app)
      .get(`/v1/brands/${page}/${limit}`)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200);
          expect(res.body.data).to.not.be.undefined;
    expect(res.body.data.list[0]._id).to.not.be.undefined;
  });

  it("should not anybody create a brand except admin", async function() {
    const userjwt = Users.makeOtherAgencyUser();
    const res = await request(app)
      .post("/v1/brands/")
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(403)
      .send({
        name: "برند",
        en_name: "testBrand",
        domain: "www.test.com"
      });
  });

  it("should only admin creates a brand", async function() {
    const userjwt = Users.makeAdminUser();
    const res = await request(app)
      .post("/v1/brands/")
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200)
      .send({
        name: "برند",
        en_name: "testBrand",
        domain: "www.test.com"
      });
  });

  it("should update a brand", async function() {
    const userjwt = Users.makeAdminUser();
    let brand = {
      name: "برند تست",
      en_name: "TEST_BRAND",
      domain: "www.TESTBRAND.com"
    };

    new_brand = new Brands(brand);
    await new_brand.save({});

    let newDomain = "www.UpdatedBrand.com";
    let newName = "برند آپدیت شده";
    const res = await request(app)
      .put(`/v1/brands/${new_brand._id}`)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200)
      .send({
        name: newName,
        domain: newDomain
      });
    expect(res.body.data.domain).to.be.equal(newDomain);
    expect(res.body.data.name).to.be.equal(newName);
  });

  it("should delete a brand", async () => {
    const userjwt = Users.makeAdminUser();
    let brand = {
      name: "1برند تست",
      en_name: "TEST_BRAND",
      domain: "www.TESTBRAND.com"
    };
    new_brand = new Brands(brand);
    await new_brand.save({});
    await request(app)
      .delete(`/v1/brands/${new_brand._id}`)
      .set("Authorization", `Bearer ${userjwt}`)
      .expect(200)
      .send()
      
  });
});
