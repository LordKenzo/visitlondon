import { add } from '../../src/js/calculator';

describe("Calculator Functions", function() {

  describe("add", function() {

    it("should add two positive numbers", function() {
      let value = add(3, 2);
      expect(value).toBe(5);
    });

  });

});