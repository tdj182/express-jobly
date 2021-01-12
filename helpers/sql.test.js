const { sqlForPartialUpdate } = require("./sql.js")

describe("sqlForPartialUpdate tests", function() {
  test("Test if return value is correct", () => {
    const res = sqlForPartialUpdate(
      { userName : "Ty"},
      { userName: "user_name"}
    )
    expect(res).toEqual(
      {
        setCols: "\"user_name\"=$1",
        values: ['Ty']
      }
    )
  })
})