"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Company = require("./company.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  jobIDs
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "newJ",
    salary: 60000,
    equity: "0",
    companyHandle: "c1"
  }

  test("create new job", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob)
  })
})

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function() {
    let jobs  = await Job.findAll();
    expect(jobs).toEqual([
    {
      id: jobs[0].id,
      title: "j1",
      salary: 100,
      equity: "0",
      companyHandle: "c1"
    },
    {
      id: jobs[1].id,
      title: "j2",
      salary: 200,
      equity: "0.1",
      companyHandle: "c2"
    },
    {
      id: jobs[2].id,
      title: "j3",
      salary: 300,
      equity: "0.2",
      companyHandle: "c3"
    },
    ])
  })
})


/************************************** get */
describe("get", function() {
  test("work", async function() {
    let job = await Job.get(jobIDs[0]);
    expect(job).toEqual({
      id: jobIDs[0],
      title: "j1",
      salary: 100,
      equity: "0",
      companyHandle: "c1"
    })
  })
})
