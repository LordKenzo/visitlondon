describe("One is One?", () => {
  it("check value", () => {
   expect(1).toBe(1)
  })
 });

 describe("Two is not One?", () => {
  it("check value", () => {
   expect(2).not.toBe(1)
  })
 });