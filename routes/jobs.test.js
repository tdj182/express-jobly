"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  jobIDs
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("search for all", async function () {
    const res = await request(app).get("/jobs");
    expect(res.body).toEqual({
      jobs: 
      [
        {
          id: jobIDs[0],
          title: "j1",
          salary: 100,
          equity: "0",
          companyHandle: "c1",
          name: "C1"
        },
        {
          id: jobIDs[1],
          title: "j2",
          salary: 200,
          equity: "0.1",
          companyHandle: "c2",
          name: "C2"
        },
        {
          id: jobIDs[2],
          title: "j3",
          salary: 300,
          equity: "0.2",
          companyHandle: "c3",
          name: "C3"
        },
      ]
    })
  })

  test("search with filtering", async function () {
    const res = await request(app).get(`/jobs`).query({ minSalary: 200 });
    expect(res.body).toEqual({
          jobs: [
            {
              id: jobIDs[1],
              title: "j2",
              salary: 200,
              equity: "0.1",
              companyHandle: "c2",
              name: "C2"
            },
            {
              id: jobIDs[2],
              title: "j3",
              salary: 300,
              equity: "0.2",
              companyHandle: "c3",
              name: "C3"
            },
          ],
        },
    );
  });
})


/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "newJ",
    salary: 500,
    equity: "0.2",
    companyHandle: "c1"
  };

  test("works", async function () {
    const res = await request(app).post("/jobs").send(newJob).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "newJ",
        salary: 500,
        equity: "0.2",
        companyHandle: "c1"
      },
    });
  });

  test("bad request with missing data", async function () {
    const res = await request(app).post("/companies").send({
          title: "missing handle"
        }).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  test("works", async function () {
    const res = await request(app).get(`/jobs/${jobIDs[0]}`);
    expect(res.body).toEqual({
      job: {
        id: jobIDs[0],
        title: "j1",
        salary: 100,
        equity: "0",
        companyHandle: "c1",
      },
    });
  });
});

/************************************** PATCH /jobs/:id */


describe("PATCH /jobs/:id", function () {
  test("works with admin", async function () {
    const res = await request(app).patch(`/jobs/${jobIDs[0]}`).send({
          title: "updated",
        }).set("authorization", `Bearer ${u2Token}`);
    expect(res.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "updated",
        salary: 100,
        equity: "0",
        companyHandle: "c1",
      },
    });
  });
});


/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
  test("works with admin", async function () {
    const res = await request(app).delete(`/jobs/${jobIDs[0]}`)
    .set("authorization", `Bearer ${u2Token}`);
    expect(res.body).toEqual({ deleted: `${jobIDs[0]}` });
  });
});