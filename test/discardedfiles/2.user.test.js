const chai = require("chai");
const assert = chai.assert;
const request = require("supertest");
const app = require("../app");

describe("POST /api/v1/user", function () {
  it('it should POST a user with "admin" on profile', () => {
    return request(app)
      .post("/api/v1/user")
      .send({ name: "Name1", lastName: "LastName1", profile: "admin" })
      .then(function (res) {
        assert.equal(res.status, 201);
      });
  });

  it('it should POST a user with "guest" on profile', () => {
    return request(app)
      .post("/api/v1/user")
      .send({ name: "Name2", lastName: "LastName2", profile: "guest" })
      .then(function (res) {
        assert.equal(res.status, 201);
      });
  });

  it('it should NOT POST a user without "guest" or "admin" on profile', () => {
    return request(app)
      .post("/api/v1/user")
      .send({
        name: "Name3",
        lastName: "LastName3",
        profile: "not a admin or guest",
      })
      .then(function (res) {
        assert.equal(res.status, 401);
      });
  });
});

describe("GET /api/v1/user", function () {
  it("should return OK status for GET ALL", () => {
    return request(app)
      .get("/api/v1/user")
      .then(function (res) {
        assert.equal(res.status, 200);
      });
  });

  it("should return OK status for GET FILTERED", () => {
    return request(app)
      .get("/api/v1/user/1")
      .then(function (res) {
        assert.equal(res.status, 200);
      });
  });

  it("should return a NOT FOUND status for GET FILTERED", () => {
    return request(app)
      .get("/api/v1/user/5")
      .then(function (res) {
        assert.equal(res.status, 404);
      });
  });
});

describe("PUT /api/v1/user", function () {
  it('it should PUT a user with "guest" on profile', () => {
    return request(app)
      .put("/api/v1/user/1")
      .send({
        name: "UpdatedName1",
        lastName: "UpdatedLastName1",
        profile: "guest",
      })
      .then(function (res) {
        assert.equal(res.status, 200);
      });
  });

  it('it should PUT a user with "admin" on profile', () => {
    return request(app)
      .put("/api/v1/user/2")
      .send({
        name: "UpdatedName2",
        lastName: "UpdatedLastName2",
        profile: "admin",
      })
      .then(function (res) {
        assert.equal(res.status, 200);
      });
  });

  it('it should NOT PUT a user without "guest" or "admin" on profile', () => {
    return request(app)
      .put("/api/v1/user/1")
      .send({
        name: "UpdatedName3",
        lastName: "UpdatedLastName3",
        profile: "not a admin or guest",
      })
      .then(function (res) {
        assert.equal(res.status, 401);
      });
  });

  it("it should NOT PUT user 3 (not exists)", () => {
    return request(app)
      .put("/api/v1/user/3")
      .send({
        name: "UserNotExists",
        lastName: "UserNotExists",
        profile: "admin",
      })
      .then(function (res) {
        assert.equal(res.status, 401);
      });
  });
});

describe("DELETE /api/v1/user", function () {
  it("it should DELETE user 1", () => {
    return request(app)
      .delete("/api/v1/user/1")
      .then(function (res) {
        assert.equal(res.status, 200);
      });
  });

  it("it should DELETE user 2", () => {
    return request(app)
      .delete("/api/v1/user/2")
      .then(function (res) {
        assert.equal(res.status, 200);
      });
  });

  it("it should NOT DELETE user 3 (not exists)", () => {
    return request(app)
      .delete("/api/v1/user/3")
      .then(function (res) {
        assert.equal(res.status, 204);
      });
  });
});
