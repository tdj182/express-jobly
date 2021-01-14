"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be {title, salary, equity, companyHandle }
   *
   * Returns {title, salary, equity, companyHandle }
   *
   * Throws BadRequestError if job already in database.
   * */

  static async create({title, salary, equity, companyHandle}) {
    const result = await db.query(
      `INSERT INTO jobs
      (title, salary, equity, company_handle)
      VALUES ($1, $2, $3, $4)
      RETURNING title, salary, equity, company_handle AS "companyHandle"`,
      [title, salary, equity, companyHandle]
    )
    
    const job = result.rows[0]
    
    return job;
  };

    /** Find all jobs with or without a filter.
   *
   * Returns [{ title, salary, equity, company_handle }, ...]
   * */
  static async findAll(optionalFilters={}) {

    const jobsRes = await db.query(`
      SELECT id, title, salary, equity, company_handle AS "companyHandle" FROM jobs`)

    return jobsRes.rows;
  }

  static async get(id) {
    const jobRes = await db.query(
      `SELECT id,
              title,
              salary,
              equity,
              company_handle AS "companyHandle"
       FROM jobs
       WHERE id = $1`,
    [id]);

    const job = jobRes.rows[0];
    if (!job) throw new NotFoundError(`No job: ${id}`);
    return job
  }

    /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data){
    const {setCols, values} = sqlForPartialUpdate(
      data,
      {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity,
                                company_handle AS "companyHandle"`;

    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

    /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
  }
}

module.exports = Job;

// CREATE TABLE jobs (
//   id SERIAL PRIMARY KEY,
//   title TEXT NOT NULL,
//   salary INTEGER CHECK (salary >= 0),
//   equity NUMERIC CHECK (equity <= 1.0),
//   company_handle VARCHAR(25) NOT NULL
//     REFERENCES companies ON DELETE CASCADE
// );


    // let whereClause = []
    // let queryVals = []
    // let { title, minSalary, hasEquity } = optionalFilters;

    // let selectQuery = `
    //   SELECT title, 
    //     salary, 
    //     equity, 
    //     company_handle AS "companyHandle"
    //   FROM jobs`;

    // if (minSalary) {
    //   queryVals.push(minSalary)
    //   whereClause.push(`salary >= $${queryVals.length}`)
    // }

    // if (hasEquity) {
    //   queryVals.push(0)
    //   whereClause.push(`equity > $${queryVals.length}`)
    // }

    // if (title) {
    //   queryVals.push(title)
    //   whereClause.push(`title ILIKE $${queryVals.length}`)
    // }

    // if (whereClause.length > 0) {
    //   selectQuery += " WHERE " + whereClause.join(" AND ");
    // }

    // selectQuery += " ORDER BY title";
    // const jobsRes = await db.query(selectQuery, queryVals)
