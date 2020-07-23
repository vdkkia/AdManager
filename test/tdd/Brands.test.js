const app = require("../../index");
const request = require("supertest");
const Users = require("../Utility/Users");


describe("[Brands TDD]", function () {



    it("Should add a brand", async function () {

        const userjwt = Users.makeAdminUser();
        const res = await request(app)
            .post('/v1/brands/')
            .set("Authorization", `Bearer ${userjwt}`)
            .expect(200)
            .send({
                "name": "برند",
                "en_name": "testBrand",
                "domain": "www.test.com"
            })

    });



});