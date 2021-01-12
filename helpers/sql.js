const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
/** Writes a quick sql query given JS object
 * 
 *  Pass in new data via object
 * 
 *  jsToSql should will turn JS var names to SQL names
 * 
 *  Ex: 
 *  sqlForPartialUpdate(
      { userName : "Ty"},
      { userName: "user_name"}

      will return:
       {
        setCols: "\"user_name\"=$1",
        values: ['Ty']
      }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );



  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

// data = {firstName: 'Aliya', age: 32}
// console.log(sqlForPartialUpdate(
//   data,
//   {
//     firstName: "first_name",
//     age: "user_age",
//   }))

module.exports = { sqlForPartialUpdate };
