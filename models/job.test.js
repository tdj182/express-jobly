"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Company = require("./company.js");
const { findAll } = require("./job.js");
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

  test("not found", async function() {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  })
})


/************************************** update */

describe("update", function() {
  const updateData = {
    title: "NewJ",
    salary: 600,
    equity: "0.3",
  };

  test("works", async function () {
    let job = await Job.update(jobIDs[0], updateData);
    expect(job).toEqual({
      id: jobIDs[0],
      companyHandle: "c1",
      ...updateData,
    });
  });
})

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(jobIDs[0]);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id=$1", [jobIDs[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});